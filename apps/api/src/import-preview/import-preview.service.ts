import { BadRequestException, Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { inflateSync } from 'node:zlib';
import * as XLSX from 'xlsx';
import type {
  ImportConfirmResult,
  ImportPreviewError,
  ImportPreviewResult,
  ImportPreviewSheet,
  ImportSourceType,
  ParsedSheet,
  StoredImportPreviewData,
  UploadedImportFile
} from './import-preview.types.js';

const REQUIRED_SHEETS = [
  'base',
  '荣誉',
  '世界概览',
  '国家汇总',
  '国家荣誉',
  '俱乐部汇总',
  '俱乐部荣誉',
  '球员总表',
  '球员汇总',
  '球员荣誉',
  '最佳',
  '备注'
];

const REQUIRED_HEADERS: Record<string, string[]> = {
  世界概览: ['序号', '足联/位置/年代'],
  国家汇总: ['UID', '国家'],
  俱乐部汇总: ['UID', '球队'],
  球员总表: ['UID', '姓名'],
  球员汇总: ['UID', '姓名', 'PA'],
  备注: ['序号', '内容']
};

const UID_SHEETS = ['国家汇总', '俱乐部汇总', '球员总表', '球员汇总'];
const NUMERIC_HEADER_KEYWORDS = [
  '190',
  '180',
  '170',
  '160',
  '150',
  '140',
  '130',
  '120',
  '110',
  '100',
  'PA',
  'CA'
];
const SAMPLE_ROW_LIMIT = 5;
const CONFIRMABLE_STATUS = new Set([
  'previewed',
  'previewed_with_errors',
  'imported',
  'imported_with_errors'
]);
const CONFEDERATIONS = [
  { uid: '1', name: '非足联', code: 'NON_FIFA' },
  { uid: '2', name: '亚足联', code: 'AFC' },
  { uid: '3', name: '欧足联', code: 'UEFA' },
  { uid: '4', name: '中北美足联', code: 'CONCACAF' },
  { uid: '5', name: '大洋足联', code: 'OFC' },
  { uid: '6', name: '南美足联', code: 'CONMEBOL' }
];
const CONFEDERATION_BY_COUNTRY: Record<string, string> = {
  卡塔尔: '亚足联',
  沙特阿拉伯: '亚足联',
  印度: '亚足联',
  圣马力诺: '欧足联',
  波黑: '欧足联',
  俄罗斯: '欧足联',
  埃及: '非足联'
};

interface CountryRefs {
  idByUid: Map<string, string>;
  idByName: Map<string, string>;
}

interface ClubRefs {
  idByUid: Map<string, string>;
  idByName: Map<string, string>;
}

@Injectable()
export class ImportPreviewService {
  constructor(private readonly prisma: PrismaService) {}

  async preview(
    file: UploadedImportFile,
    sourceType?: ImportSourceType
  ): Promise<ImportPreviewResult> {
    if (!file) {
      throw new BadRequestException('请上传 lakesheet、Excel 或 CSV 文件。');
    }

    const fileType = this.resolveFileType(file.originalname);
    const resolvedSourceType = sourceType ?? this.resolveSourceType(fileType);

    const task = await this.prisma.importTask.create({
      data: {
        fileName: file.originalname,
        fileType,
        sourceType: resolvedSourceType,
        status: 'parsing',
        startedAt: new Date()
      }
    });

    try {
      const parsedSheets = this.parseFile(file, fileType);
      const sheets = parsedSheets.map((sheet) => this.toPreviewSheet(sheet));
      const errors = this.validateSheets(parsedSheets);
      const totalRows = sheets.reduce((total, sheet) => total + Math.max(sheet.rowCount - 1, 0), 0);
      const status = errors.length > 0 ? 'previewed_with_errors' : 'previewed';

      const updatedTask = await this.prisma.importTask.update({
        where: { id: task.id },
        data: {
          status,
          totalRows,
          failedRows: errors.length,
          previewData: this.toStoredPreviewData(parsedSheets) as unknown as Prisma.InputJsonValue,
          finishedAt: new Date()
        }
      });

      return {
        task: {
          id: updatedTask.id,
          fileName: updatedTask.fileName,
          fileType: updatedTask.fileType,
          sourceType: updatedTask.sourceType as ImportSourceType,
          status: updatedTask.status,
          totalRows: updatedTask.totalRows,
          failedRows: updatedTask.failedRows,
          createdAt: updatedTask.createdAt
        },
        summary: {
          sheetCount: sheets.length,
          totalRows,
          errorCount: errors.length
        },
        sheets,
        errors
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : '文件解析失败。';

      await this.prisma.importTask.update({
        where: { id: task.id },
        data: {
          status: 'failed',
          failedRows: 1,
          finishedAt: new Date()
        }
      });

      throw new BadRequestException(message);
    }
  }

  async confirm(taskId: string): Promise<ImportConfirmResult> {
    const task = await this.prisma.importTask.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      throw new BadRequestException('导入任务不存在。');
    }

    if (!CONFIRMABLE_STATUS.has(task.status)) {
      throw new BadRequestException('当前导入任务状态不支持确认导入。');
    }

    const parsedSheets = this.readStoredPreviewData(task.previewData);
    if (parsedSheets.length === 0) {
      throw new BadRequestException('当前导入任务没有可导入的预览数据，请重新生成预览。');
    }

    const sheetMap = new Map(parsedSheets.map((sheet) => [sheet.name, sheet]));
    const imported = {
      countries: 0,
      clubs: 0,
      players: 0,
      positions: 0,
      playerTypes: 0,
      confederations: 0,
      potentialRanges: 0,
      ethnicities: 0,
      hairColors: 0,
      preferredFeet: 0
    };

    const result = await this.prisma.$transaction(async (tx) => {
      const confederationIdByName = await this.importConfederations(tx);
      imported.confederations = confederationIdByName.size;
      imported.positions = await this.importPositions(tx, sheetMap.get('base'));
      imported.playerTypes = await this.importPlayerTypes(tx, sheetMap.get('base'));
      imported.potentialRanges = await this.importPotentialRanges(tx, sheetMap.get('base'));
      const ethnicityIdByCode = await this.importEthnicities(tx, sheetMap.get('base'));
      imported.ethnicities = ethnicityIdByCode.size;
      const hairColorIdByCode = await this.importHairColors(tx, sheetMap.get('base'));
      imported.hairColors = hairColorIdByCode.size;
      const preferredFootIdByCode = await this.importPreferredFeet(tx, sheetMap.get('base'));
      imported.preferredFeet = preferredFootIdByCode.size;

      const playerTypeIdByName = await this.readPlayerTypeIdByName(tx);
      const countryRefs = await this.importCountries(
        tx,
        sheetMap.get('国家汇总'),
        confederationIdByName
      );
      imported.countries = countryRefs.idByUid.size;

      const clubRefs = await this.importClubs(
        tx,
        sheetMap.get('俱乐部汇总'),
        countryRefs,
        confederationIdByName
      );
      imported.clubs = clubRefs.idByUid.size;

      imported.players = await this.importPlayers(
        tx,
        sheetMap.get('球员总表'),
        countryRefs,
        clubRefs,
        confederationIdByName,
        ethnicityIdByCode,
        hairColorIdByCode,
        preferredFootIdByCode,
        playerTypeIdByName
      );

      const successRows =
        imported.confederations +
        imported.positions +
        imported.playerTypes +
        imported.potentialRanges +
        imported.ethnicities +
        imported.hairColors +
        imported.preferredFeet +
        imported.countries +
        imported.clubs +
        imported.players;
      const failedRows = 0;
      const status = 'imported';
      const updatedTask = await tx.importTask.update({
        where: { id: taskId },
        data: {
          status,
          successRows,
          failedRows,
          finishedAt: new Date()
        }
      });

      return {
        task: {
          id: updatedTask.id,
          status: updatedTask.status,
          successRows: updatedTask.successRows,
          failedRows: updatedTask.failedRows
        },
        imported,
        skipped: 0,
        errors: []
      };
    });

    return result;
  }

  private readStoredPreviewData(previewData: unknown): ParsedSheet[] {
    const record = this.asRecord(previewData);
    const storedSheets = Array.isArray(record.sheets) ? record.sheets : [];

    return storedSheets
      .map((sheet) => {
        const sheetRecord = this.asRecord(sheet);
        const rows = Array.isArray(sheetRecord.rows) ? sheetRecord.rows : [];

        return {
          name: this.toCellString(sheetRecord.name),
          rows: rows.map((row) => (Array.isArray(row) ? row : []))
        };
      })
      .filter((sheet) => sheet.name && sheet.rows.length > 0);
  }

  private async importConfederations(tx: Prisma.TransactionClient): Promise<Map<string, string>> {
    const idByName = new Map<string, string>();

    for (const [index, confederation] of CONFEDERATIONS.entries()) {
      const record = await tx.confederation.upsert({
        where: { uid: confederation.uid },
        create: {
          ...confederation,
          sortOrder: index + 1
        },
        update: {
          name: confederation.name,
          code: confederation.code,
          sortOrder: index + 1
        }
      });

      idByName.set(record.name, record.id);
    }

    return idByName;
  }

  private async importPositions(
    tx: Prisma.TransactionClient,
    sheet?: ParsedSheet
  ): Promise<number> {
    if (!sheet) {
      return 0;
    }

    const seen = new Set<string>();
    let imported = 0;

    for (const [index, row] of sheet.rows.slice(1, 15).entries()) {
      const name = this.toNullableString(row[4]);
      const code = this.toCode(row[5] ?? name);

      if (!name || !code || seen.has(code)) {
        continue;
      }

      seen.add(code);
      await tx.position.upsert({
        where: { code },
        create: {
          code,
          name,
          description: this.toNullableString(row[6]),
          sortOrder: index + 1
        },
        update: {
          name,
          description: this.toNullableString(row[6]),
          sortOrder: index + 1,
          enabled: true
        }
      });
      imported += 1;
    }

    await tx.position.deleteMany({
      where: {
        code: {
          notIn: [...seen]
        }
      }
    });

    return imported;
  }

  private async importPlayerTypes(
    tx: Prisma.TransactionClient,
    sheet?: ParsedSheet
  ): Promise<number> {
    if (!sheet) {
      return 0;
    }

    const seen = new Set<string>();
    let imported = 0;

    for (const [index, row] of sheet.rows.slice(1, 14).entries()) {
      const name = this.toNullableString(row[8]);
      const code = this.toCode(name);

      if (!name || !code || seen.has(code)) {
        continue;
      }

      seen.add(code);
      await tx.playerType.upsert({
        where: { code },
        create: {
          code,
          name,
          sortOrder: index + 1
        },
        update: {
          name,
          sortOrder: index + 1,
          enabled: true
        }
      });
      imported += 1;
    }

    await tx.potentialRange.deleteMany({
      where: {
        code: {
          notIn: [...seen]
        }
      }
    });

    return imported;
  }

  private async importPotentialRanges(
    tx: Prisma.TransactionClient,
    sheet?: ParsedSheet
  ): Promise<number> {
    if (!sheet) {
      return 0;
    }

    const seen = new Set<string>();
    let imported = 0;

    for (const [index, row] of sheet.rows.slice(1, 10).entries()) {
      const code = this.toCellString(row[10]);
      const description = this.toNullableString(row[11]);

      if (!code || !description || seen.has(code)) {
        continue;
      }

      seen.add(code);
      await tx.potentialRange.upsert({
        where: { code },
        create: {
          code,
          description,
          sortOrder: index + 1
        },
        update: {
          description,
          sortOrder: index + 1
        }
      });
      imported += 1;
    }

    return imported;
  }

  private async importEthnicities(
    tx: Prisma.TransactionClient,
    sheet?: ParsedSheet
  ): Promise<Map<string, string>> {
    return this.importCodeDictionary(tx, sheet, {
      startRow: 16,
      nameColumn: 4,
      codeColumn: 5,
      descriptionColumn: 6,
      upsert: (record) =>
        tx.ethnicity.upsert({
          where: { code: record.code },
          create: record,
          update: {
            name: record.name,
            description: record.description,
            sortOrder: record.sortOrder
          }
        })
    });
  }

  private async importHairColors(
    tx: Prisma.TransactionClient,
    sheet?: ParsedSheet
  ): Promise<Map<string, string>> {
    return this.importCodeDictionary(tx, sheet, {
      startRow: 16,
      nameColumn: 9,
      codeColumn: 10,
      descriptionColumn: 11,
      upsert: (record) =>
        tx.hairColor.upsert({
          where: { code: record.code },
          create: record,
          update: {
            name: record.name,
            description: record.description,
            sortOrder: record.sortOrder
          }
        })
    });
  }

  private async importPreferredFeet(
    tx: Prisma.TransactionClient,
    sheet?: ParsedSheet
  ): Promise<Map<string, string>> {
    return this.importCodeDictionary(tx, sheet, {
      startRow: 16,
      nameColumn: 13,
      codeColumn: 14,
      upsert: (record) =>
        tx.preferredFoot.upsert({
          where: { code: record.code },
          create: record,
          update: {
            name: record.name,
            description: record.description,
            sortOrder: record.sortOrder
          }
        })
    });
  }

  private async readPlayerTypeIdByName(tx: Prisma.TransactionClient): Promise<Map<string, string>> {
    const playerTypes = await tx.playerType.findMany({
      select: {
        id: true,
        name: true
      }
    });

    return new Map(playerTypes.map((playerType) => [playerType.name, playerType.id]));
  }

  private async importCountries(
    tx: Prisma.TransactionClient,
    sheet: ParsedSheet | undefined,
    confederationIdByName: Map<string, string>
  ): Promise<CountryRefs> {
    const countryIdByUid = new Map<string, string>();
    const countryIdByName = new Map<string, string>();

    if (!sheet) {
      return {
        idByUid: countryIdByUid,
        idByName: countryIdByName
      };
    }

    const headers = this.normalizeHeaders(sheet.rows[0] ?? []);

    for (const [index, row] of sheet.rows.slice(1).entries()) {
      if (this.isEmptyRow(row)) {
        continue;
      }

      const uid = this.cellByHeader(headers, row, 'UID');
      const importKey = this.createImportKey(sheet.name, uid, index);
      const federation =
        this.toNullableString(this.cellByHeader(headers, row, '足联')) ??
        this.inferConfederationByCountry(this.cellByHeader(headers, row, '国家'));
      const name = this.cellByHeader(headers, row, '国家') || uid || importKey;

      const data = {
        uid: uid || '-',
        name,
        federation,
        federationId: federation ? (confederationIdByName.get(federation) ?? null) : null,
        playerCount: this.toNullableNumber(this.cellByHeader(headers, row, '总数')),
        totalPa: this.toNullableNumber(this.cellByHeader(headers, row, '总PA')),
        averagePa: this.toNullableNumber(this.cellByHeader(headers, row, '平均PA')),
        medalCount: this.toNullableNumber(this.cellByHeader(headers, row, '奖牌数')),
        championCount: this.toNullableNumber(this.cellByHeader(headers, row, '冠军数')),
        majorChampionCount: this.toNullableNumber(this.cellByHeader(headers, row, '重要冠军')),
        honorScore: this.toNullableNumber(this.cellByHeader(headers, row, '荣誉分'))
      };
      const country = await tx.country.upsert({
        where: { importKey },
        create: {
          importKey,
          ...data
        },
        update: data
      });

      if (uid && uid !== '-') {
        countryIdByUid.set(uid, country.id);
      }
      countryIdByName.set(name, country.id);
    }

    return {
      idByUid: countryIdByUid,
      idByName: countryIdByName
    };
  }

  private async importClubs(
    tx: Prisma.TransactionClient,
    sheet: ParsedSheet | undefined,
    countryRefs: CountryRefs,
    confederationIdByName: Map<string, string>
  ): Promise<ClubRefs> {
    const clubIdByUid = new Map<string, string>();
    const clubIdByName = new Map<string, string>();

    if (!sheet) {
      return {
        idByUid: clubIdByUid,
        idByName: clubIdByName
      };
    }

    const headers = this.normalizeHeaders(sheet.rows[0] ?? []);

    for (const [index, row] of sheet.rows.slice(1).entries()) {
      if (this.isEmptyRow(row)) {
        continue;
      }

      const uid = this.cellByHeader(headers, row, 'UID');
      const importKey = this.createImportKey(sheet.name, uid, index);
      const countryName = this.toNullableString(this.cellByHeader(headers, row, '国家'));
      const federation =
        this.toNullableString(this.cellByHeader(headers, row, '国家UID')) ??
        this.inferConfederationByCountry(countryName);
      const countryId = countryName
        ? await this.ensureCountryRef(tx, countryRefs, {
            countryName,
            federation,
            confederationId: federation ? (confederationIdByName.get(federation) ?? null) : null
          })
        : null;

      const data = {
        uid: uid || '-',
        name: this.cellByHeader(headers, row, '球队') || uid || importKey,
        exists: true,
        countryUid: this.toNullableString(this.cellByHeader(headers, row, '国家UID')),
        countryId,
        country: countryName,
        federation,
        federationId: federation ? (confederationIdByName.get(federation) ?? null) : null,
        playerCount: this.toNullableNumber(this.cellByHeader(headers, row, '总数', 0)),
        totalPa: this.toNullableNumber(this.cellByHeader(headers, row, '总PA')),
        averagePa: this.toNullableNumber(this.cellByHeader(headers, row, '平均PA')),
        trophyCount: this.toNullableNumber(this.cellByHeader(headers, row, '总数', 1)),
        championCount: this.toNullableNumber(this.cellByHeader(headers, row, '冠军数')),
        honorScore: this.toNullableNumber(this.cellByHeader(headers, row, '荣誉分'))
      };
      const club = await tx.club.upsert({
        where: { importKey },
        create: {
          importKey,
          ...data
        },
        update: data
      });

      if (uid && uid !== '-') {
        clubIdByUid.set(uid, club.id);
      }
      clubIdByName.set(club.name, club.id);
    }

    return {
      idByUid: clubIdByUid,
      idByName: clubIdByName
    };
  }

  private async ensureCountryRef(
    tx: Prisma.TransactionClient,
    countryRefs: CountryRefs,
    input: {
      countryName: string;
      federation: string | null;
      confederationId: string | null;
    }
  ): Promise<string> {
    const existingCountryId = countryRefs.idByName.get(input.countryName);
    if (existingCountryId) {
      if (input.federation || input.confederationId) {
        await tx.country.update({
          where: { id: existingCountryId },
          data: {
            federation: input.federation,
            federationId: input.confederationId
          }
        });
      }

      return existingCountryId;
    }

    const importKey = `club-country:${this.toCode(input.countryName)}`;
    const country = await tx.country.upsert({
      where: { importKey },
      create: {
        importKey,
        uid: '-',
        name: input.countryName,
        federation: input.federation,
        federationId: input.confederationId
      },
      update: {
        name: input.countryName,
        federation: input.federation,
        federationId: input.confederationId
      }
    });

    countryRefs.idByName.set(input.countryName, country.id);

    return country.id;
  }

  private async importPlayers(
    tx: Prisma.TransactionClient,
    sheet: ParsedSheet | undefined,
    countryRefs: CountryRefs,
    clubRefs: ClubRefs,
    confederationIdByName: Map<string, string>,
    ethnicityIdByCode: Map<string, string>,
    hairColorIdByCode: Map<string, string>,
    preferredFootIdByCode: Map<string, string>,
    playerTypeIdByName: Map<string, string>
  ): Promise<number> {
    if (!sheet) {
      return 0;
    }

    const headers = this.normalizeHeaders(sheet.rows[0] ?? []);
    let imported = 0;

    for (const [index, row] of sheet.rows.slice(1).entries()) {
      if (this.isEmptyRow(row)) {
        continue;
      }

      const uid = this.cellByHeader(headers, row, 'UID');
      const importKey = this.createImportKey(sheet.name, uid, index);

      const countryUid = this.toNullableString(this.cellByHeader(headers, row, '国籍UID'));
      const clubUid = this.toNullableString(this.cellByHeader(headers, row, '俱乐部UID'));
      const confederation = this.toNullableString(this.cellByHeader(headers, row, '足联'));
      const representedCountry = this.toNullableString(this.cellByHeader(headers, row, '代表国籍'));
      const nationality = this.toNullableString(this.cellByHeader(headers, row, '国籍'));
      const primaryClub = this.toNullableString(this.cellByHeader(headers, row, '主要球队'));
      const clubs = this.toNullableString(this.cellByHeader(headers, row, '球队'));
      if (
        !this.hasImportablePlayerIdentity(
          uid,
          countryUid,
          representedCountry,
          nationality,
          clubUid,
          primaryClub,
          clubs,
          confederation
        )
      ) {
        continue;
      }
      const ethnicityCode = this.parseLeadingCode(this.cellByHeader(headers, row, '种族'));
      const hairColorCode = this.parseTrailingCode(this.cellByHeader(headers, row, '发色'));
      const preferredFootCode = this.parsePreferredFootCode(
        this.cellByHeader(headers, row, '左/右脚')
      );
      const playerType = this.toNullableString(this.cellByHeader(headers, row, '类型'));
      const countryId = this.resolveCountryId(
        countryRefs,
        countryUid,
        representedCountry,
        nationality
      );
      const clubId = await this.resolvePlayerClubId(tx, clubRefs, {
        clubUid,
        primaryClub,
        clubs,
        countryId,
        countryName: nationality,
        federation: confederation,
        federationId: confederation ? (confederationIdByName.get(confederation) ?? null) : null
      });
      const data = {
        uid: uid || '-',
        chineseName:
          this.cellByHeader(headers, row, '姓名') ||
          this.cellByHeader(headers, row, '英文名') ||
          uid ||
          importKey,
        englishName: this.toNullableString(this.cellByHeader(headers, row, '英文名')),
        birthDate: this.toNullableDate(this.cellByHeader(headers, row, '生日')),
        deathDate: this.toNullableDate(this.cellByHeader(headers, row, '过世')),
        age: this.toNullableNumber(this.cellByHeader(headers, row, '年龄')),
        primaryRole: this.toNullableString(this.cellByHeader(headers, row, '主要位置')),
        positions: this.toNullableString(this.cellByHeader(headers, row, '位置')),
        ca: this.toNullableNumber(this.cellByHeader(headers, row, 'CA')),
        pa: this.toNullableNumber(this.cellByHeader(headers, row, 'PA')),
        height: this.toNullableNumber(this.cellByHeader(headers, row, '身高')),
        weight: this.toNullableNumber(this.cellByHeader(headers, row, '体重')),
        shirtNumber: this.toNullableString(this.cellByHeader(headers, row, '球衣')),
        skinTone: this.toNullableString(this.cellByHeader(headers, row, '肤色')),
        hairColor: this.toNullableString(this.cellByHeader(headers, row, '发色')),
        hairColorId: hairColorCode ? (hairColorIdByCode.get(hairColorCode) ?? null) : null,
        ethnicity: this.toNullableString(this.cellByHeader(headers, row, '种族')),
        ethnicityId: ethnicityCode ? (ethnicityIdByCode.get(ethnicityCode) ?? null) : null,
        foot: this.toNullableString(this.cellByHeader(headers, row, '左/右脚')),
        preferredFootId: preferredFootCode
          ? (preferredFootIdByCode.get(preferredFootCode) ?? null)
          : null,
        playerType,
        playerTypeId: playerType ? (playerTypeIdByName.get(playerType) ?? null) : null,
        confederation,
        confederationId: confederation ? (confederationIdByName.get(confederation) ?? null) : null,
        countryUid,
        representedCountry,
        nationality,
        birthCityUid: this.toNullableString(this.cellByHeader(headers, row, '出生城市UID')),
        birthCity: this.toNullableString(this.cellByHeader(headers, row, '出生城市')),
        primaryClub,
        clubUid,
        initialClub: this.toNullableString(this.cellByHeader(headers, row, '初始球队')),
        clubs,
        marketValue: this.toNullableNumber(this.cellByHeader(headers, row, '市场价值（万欧）')),
        retired: this.toNullableBoolean(this.cellByHeader(headers, row, '是否退役')),
        deceased: this.toNullableBoolean(this.cellByHeader(headers, row, '是否去世')),
        databaseSource: this.toNullableString(this.cellByHeader(headers, row, '数据库')),
        staffRoles: this.toNullableString(this.cellByHeader(headers, row, '担任过职位')),
        achievement: this.toNullableString(this.cellByHeader(headers, row, '成就')),
        remark: this.toNullableString(this.cellByHeader(headers, row, '备注')),
        countryId,
        clubId
      };

      await tx.player.upsert({
        where: { importKey },
        create: {
          importKey,
          ...data
        },
        update: data
      });
      imported += 1;
    }

    await tx.player.deleteMany({
      where: {
        uid: '-',
        countryId: null,
        clubId: null,
        confederationId: null
      }
    });

    return imported;
  }

  private resolveCountryId(
    countryRefs: CountryRefs,
    countryUid: string | null,
    representedCountry: string | null,
    nationality: string | null
  ): string | null {
    if (countryUid && countryRefs.idByUid.has(countryUid)) {
      return countryRefs.idByUid.get(countryUid) ?? null;
    }

    if (representedCountry && countryRefs.idByName.has(representedCountry)) {
      return countryRefs.idByName.get(representedCountry) ?? null;
    }

    if (nationality && countryRefs.idByName.has(nationality)) {
      return countryRefs.idByName.get(nationality) ?? null;
    }

    return null;
  }

  private hasImportablePlayerIdentity(
    uid: string,
    countryUid: string | null,
    representedCountry: string | null,
    nationality: string | null,
    clubUid: string | null,
    primaryClub: string | null,
    clubs: string | null,
    confederation: string | null
  ): boolean {
    return Boolean(
      (uid && uid !== '-') ||
      countryUid ||
      representedCountry ||
      nationality ||
      clubUid ||
      primaryClub ||
      clubs ||
      confederation
    );
  }

  private async resolvePlayerClubId(
    tx: Prisma.TransactionClient,
    clubRefs: ClubRefs,
    input: {
      clubUid: string | null;
      primaryClub: string | null;
      clubs: string | null;
      countryId: string | null;
      countryName: string | null;
      federation: string | null;
      federationId: string | null;
    }
  ): Promise<string | null> {
    if (input.clubUid && clubRefs.idByUid.has(input.clubUid)) {
      return clubRefs.idByUid.get(input.clubUid) ?? null;
    }

    const clubName = input.primaryClub ?? this.firstListValue(input.clubs);
    if (!clubName) {
      return null;
    }

    if (clubRefs.idByName.has(clubName)) {
      return clubRefs.idByName.get(clubName) ?? null;
    }

    const importKey = `player-club:${input.clubUid ?? this.toCode(clubName)}`;
    const club = await tx.club.upsert({
      where: { importKey },
      create: {
        importKey,
        uid: input.clubUid ?? '-',
        name: clubName,
        exists: false,
        countryId: input.countryId,
        country: input.countryName,
        federation: input.federation,
        federationId: input.federationId
      },
      update: {
        name: clubName,
        exists: false,
        countryId: input.countryId,
        country: input.countryName,
        federation: input.federation,
        federationId: input.federationId
      }
    });

    if (input.clubUid && input.clubUid !== '-') {
      clubRefs.idByUid.set(input.clubUid, club.id);
    }
    clubRefs.idByName.set(clubName, club.id);

    return club.id;
  }

  private parseFile(file: UploadedImportFile, fileType: string): ParsedSheet[] {
    if (file.size === 0) {
      throw new Error('文件内容为空。');
    }

    if (fileType === 'lakesheet') {
      return this.parseLakesheet(file.buffer);
    }

    if (fileType === 'xlsx' || fileType === 'xls' || fileType === 'csv') {
      return this.parseWorkbook(file.buffer, fileType === 'csv');
    }

    throw new Error(`暂不支持 .${fileType} 文件。`);
  }

  private parseLakesheet(buffer: Buffer): ParsedSheet[] {
    const payload = JSON.parse(buffer.toString('utf8')) as {
      sheet?: string;
      sheets?: unknown;
      data?: unknown;
    };
    const sheetPayload = payload.sheet ?? payload.sheets ?? payload.data;
    const sheets =
      typeof sheetPayload === 'string' ? this.inflateSheetPayload(sheetPayload) : sheetPayload;

    if (!Array.isArray(sheets)) {
      throw new Error('无法识别 lakesheet 工作表结构。');
    }

    return sheets.map((sheet) => {
      const sheetRecord = this.asRecord(sheet);
      return {
        name: String(sheetRecord.name ?? '未命名工作表'),
        rows: this.trimTrailingEmptyRows(
          this.lakeSheetDataToRows(
            sheetRecord.data,
            Number(sheetRecord.rowCount ?? 0),
            Number(sheetRecord.colCount ?? 0)
          )
        )
      };
    });
  }

  private inflateSheetPayload(payload: string): unknown {
    const inflated = inflateSync(Buffer.from(payload, 'binary')).toString('utf8');
    return JSON.parse(inflated) as unknown;
  }

  private parseWorkbook(buffer: Buffer, isCsv: boolean): ParsedSheet[] {
    const workbook = XLSX.read(buffer, {
      type: 'buffer',
      raw: false,
      cellDates: false,
      codepage: 65001
    });

    return workbook.SheetNames.map((name) => {
      const worksheet = workbook.Sheets[name];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
        header: 1,
        defval: '',
        raw: false
      });

      return {
        name: isCsv ? 'CSV' : name,
        rows: this.trimTrailingEmptyRows(rows)
      };
    });
  }

  private lakeSheetDataToRows(data: unknown, rowCount: number, colCount: number): unknown[][] {
    const rows: unknown[][] = [];
    const dataRecord = this.asRecord(data);
    const maxRow = Math.max(
      rowCount,
      ...Object.keys(dataRecord)
        .map((key) => Number(key) + 1)
        .filter(Number.isFinite)
    );

    for (let rowIndex = 0; rowIndex < maxRow; rowIndex += 1) {
      const rowRecord = this.asRecord(dataRecord[String(rowIndex)]);
      const maxCol = Math.max(
        colCount,
        ...Object.keys(rowRecord)
          .map((key) => Number(key) + 1)
          .filter(Number.isFinite)
      );
      const row: unknown[] = [];

      for (let colIndex = 0; colIndex < maxCol; colIndex += 1) {
        const cell = this.asRecord(rowRecord[String(colIndex)]);
        row.push(this.extractCellValue(cell));
      }

      rows.push(row);
    }

    return rows;
  }

  private toPreviewSheet(sheet: ParsedSheet): ImportPreviewSheet {
    const headers = this.normalizeHeaders(sheet.rows[0] ?? []);
    const sampleRows = sheet.rows
      .slice(1, SAMPLE_ROW_LIMIT + 1)
      .map((row) => this.rowToObject(headers, row));

    return {
      name: sheet.name,
      rowCount: sheet.rows.length,
      columnCount: headers.length,
      headers,
      sampleRows
    };
  }

  private validateSheets(sheets: ParsedSheet[]): ImportPreviewError[] {
    const errors: ImportPreviewError[] = [];
    const sheetNames = new Set(sheets.map((sheet) => sheet.name));

    for (const sheetName of REQUIRED_SHEETS) {
      if (!sheetNames.has(sheetName)) {
        errors.push({
          sheetName,
          code: 'MISSING_SHEET',
          message: `缺少关键工作表：${sheetName}`
        });
      }
    }

    for (const sheet of sheets) {
      const headers = this.normalizeHeaders(sheet.rows[0] ?? []);
      errors.push(...this.validateRequiredHeaders(sheet.name, headers));
      errors.push(...this.validateDuplicateUid(sheet, headers));
      errors.push(...this.validateNumericColumns(sheet, headers));
    }

    return errors;
  }

  private validateRequiredHeaders(sheetName: string, headers: string[]): ImportPreviewError[] {
    const requiredHeaders = REQUIRED_HEADERS[sheetName] ?? [];
    const headerSet = new Set(headers.filter(Boolean));

    return requiredHeaders
      .filter((header) => !headerSet.has(header))
      .map((header) => ({
        sheetName,
        fieldName: header,
        code: 'MISSING_HEADER',
        message: `${sheetName} 缺少关键字段：${header}`
      }));
  }

  private validateDuplicateUid(sheet: ParsedSheet, headers: string[]): ImportPreviewError[] {
    if (!UID_SHEETS.includes(sheet.name)) {
      return [];
    }

    const uidIndex = headers.indexOf('UID');
    if (uidIndex < 0) {
      return [];
    }

    const seen = new Map<string, number>();
    const errors: ImportPreviewError[] = [];

    sheet.rows.slice(1).forEach((row, index) => {
      const rowNumber = index + 2;
      if (this.isEmptyRow(row)) {
        return;
      }

      const uid = this.toCellString(row[uidIndex]);

      if (!uid || uid === '-') {
        return;
      }

      const previousRow = seen.get(uid);
      if (previousRow) {
        errors.push({
          sheetName: sheet.name,
          rowNumber,
          fieldName: 'UID',
          code: 'DUPLICATE_UID',
          message: `${sheet.name} 第 ${rowNumber} 行 UID 与第 ${previousRow} 行重复。`,
          rawValue: uid
        });
        return;
      }

      seen.set(uid, rowNumber);
    });

    return errors;
  }

  private validateNumericColumns(sheet: ParsedSheet, headers: string[]): ImportPreviewError[] {
    const numericIndexes = headers
      .map((header, index) => ({ header, index }))
      .filter(({ header }) => NUMERIC_HEADER_KEYWORDS.includes(header));
    const errors: ImportPreviewError[] = [];

    for (const { header, index } of numericIndexes) {
      sheet.rows.slice(1).forEach((row, rowIndex) => {
        const value = this.toCellString(row[index]);
        if (value && value !== '-' && Number.isNaN(Number(value))) {
          errors.push({
            sheetName: sheet.name,
            rowNumber: rowIndex + 2,
            fieldName: header,
            code: 'INVALID_NUMBER',
            message: `${sheet.name} 第 ${rowIndex + 2} 行 ${header} 不是合法数字。`,
            rawValue: value
          });
        }
      });
    }

    return errors;
  }

  private toStoredPreviewData(sheets: ParsedSheet[]): StoredImportPreviewData {
    return {
      sheets: sheets.map((sheet) => ({
        name: sheet.name,
        rows: sheet.rows.map((row) => row.map((cell) => this.toJsonCellValue(cell)))
      }))
    };
  }

  private toJsonCellValue(value: unknown): string | number | boolean | null {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    return String(value);
  }

  private cellByHeader(headers: string[], row: unknown[], header: string, occurrence = 0): string {
    let matched = 0;

    for (const [index, currentHeader] of headers.entries()) {
      if (currentHeader !== header) {
        continue;
      }

      if (matched === occurrence) {
        return this.toCellString(row[index]);
      }

      matched += 1;
    }

    return '';
  }

  private async importCodeDictionary(
    tx: Prisma.TransactionClient,
    sheet: ParsedSheet | undefined,
    options: {
      startRow: number;
      nameColumn: number;
      codeColumn: number;
      descriptionColumn?: number;
      upsert: (record: {
        code: string;
        name: string;
        description: string | null;
        sortOrder: number;
      }) => Promise<{ id: string; code: string }>;
    }
  ): Promise<Map<string, string>> {
    const idByCode = new Map<string, string>();

    if (!sheet) {
      return idByCode;
    }

    const seen = new Set<string>();
    const rows = sheet.rows.slice(options.startRow);

    for (const [index, row] of rows.entries()) {
      const name = this.toNullableString(row[options.nameColumn]);
      const code = this.toCellString(row[options.codeColumn]);

      if (!name || !code || seen.has(code)) {
        continue;
      }

      seen.add(code);
      const record = await options.upsert({
        code,
        name,
        description:
          options.descriptionColumn === undefined
            ? null
            : this.toNullableString(row[options.descriptionColumn]),
        sortOrder: index + 1
      });

      idByCode.set(record.code, record.id);
    }

    return idByCode;
  }

  private createImportKey(sheetName: string, uid: string, rowIndex: number): string {
    if (uid && uid !== '-') {
      return `${sheetName}:${uid}`;
    }

    return `${sheetName}:row-${rowIndex + 2}`;
  }

  private parseLeadingCode(value: unknown): string | null {
    const text = this.toCellString(value);
    const match = text.match(/^-?\d+/);
    return match?.[0] ?? null;
  }

  private parseTrailingCode(value: unknown): string | null {
    const text = this.toCellString(value);
    const match = text.match(/(-?\d+)$/);
    return match?.[1] ?? null;
  }

  private parsePreferredFootCode(value: unknown): string | null {
    const text = this.toCellString(value);
    const first = text.split('/')[0]?.trim();

    return first && /^-?\d+$/.test(first) ? first : null;
  }

  private firstListValue(value: unknown): string | null {
    const text = this.toCellString(value);
    const first = text.split(/[、,，/]/)[0]?.trim();

    return first || null;
  }

  private inferConfederationByCountry(value: unknown): string | null {
    const countryName = this.toNullableString(value);

    return countryName ? (CONFEDERATION_BY_COUNTRY[countryName] ?? null) : null;
  }

  private toNullableString(value: unknown): string | null {
    const text = this.toCellString(value);
    return text && text !== '-' ? text : null;
  }

  private toNullableNumber(value: unknown): number | null {
    const text = this.toCellString(value).replace(/,/g, '');

    if (!text || text === '-') {
      return null;
    }

    const numberValue = Number(text);
    return Number.isFinite(numberValue) ? numberValue : null;
  }

  private toNullableBoolean(value: unknown): boolean | null {
    const text = this.toCellString(value).toLowerCase();

    if (['是', 'true', 'yes', 'y', '1'].includes(text)) {
      return true;
    }

    if (['否', 'false', 'no', 'n', '0'].includes(text)) {
      return false;
    }

    return null;
  }

  private toNullableDate(value: unknown): Date | null {
    const text = this.toCellString(value);

    if (!text || text === '-') {
      return null;
    }

    if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(text)) {
      const date = new Date(text.replace(/\//g, '-'));
      return Number.isNaN(date.getTime()) ? null : date;
    }

    const numberValue = Number(text);
    if (!Number.isFinite(numberValue)) {
      return null;
    }

    if (numberValue > 10_000_000_000) {
      const date = new Date(numberValue);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    if (numberValue > 10_000_000) {
      const date = new Date(numberValue * 1000);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    if (numberValue > 20_000) {
      const excelEpoch = Date.UTC(1899, 11, 30);
      const date = new Date(excelEpoch + numberValue * 24 * 60 * 60 * 1000);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    return null;
  }

  private toCode(value: unknown): string {
    return this.toCellString(value)
      .replace(/\s+/g, '_')
      .replace(/[^\p{L}\p{N}_-]/gu, '')
      .toUpperCase();
  }

  private normalizeHeaders(row: unknown[]): string[] {
    return row.map((cell) => this.toCellString(cell));
  }

  private trimTrailingEmptyRows(rows: unknown[][]): unknown[][] {
    let lastContentRowIndex = rows.length - 1;

    while (lastContentRowIndex >= 0 && this.isEmptyRow(rows[lastContentRowIndex] ?? [])) {
      lastContentRowIndex -= 1;
    }

    return rows.slice(0, lastContentRowIndex + 1);
  }

  private isEmptyRow(row: unknown[]): boolean {
    return row.every((cell) => this.toCellString(cell) === '');
  }

  private rowToObject(headers: string[], row: unknown[]): Record<string, unknown> {
    return headers.reduce<Record<string, unknown>>((record, header, index) => {
      const key = header || `列${index + 1}`;
      record[key] = row[index] ?? '';
      return record;
    }, {});
  }

  private resolveFileType(fileName: string): string {
    const fileType = fileName.split('.').pop()?.toLowerCase();
    return fileType ?? '';
  }

  private resolveSourceType(fileType: string): ImportSourceType {
    if (fileType === 'lakesheet') {
      return 'lakesheet';
    }

    if (fileType === 'csv') {
      return 'csv';
    }

    return 'excel';
  }

  private toCellString(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value).trim();
  }

  private extractCellValue(cell: Record<string, unknown>): unknown {
    const value = cell.v ?? cell.value ?? cell.m ?? '';
    const valueRecord = this.asRecord(value);

    if (valueRecord.class === 'formula') {
      return valueRecord.value ?? '';
    }

    return value;
  }

  private asRecord(value: unknown): Record<string, unknown> {
    return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
  }
}
