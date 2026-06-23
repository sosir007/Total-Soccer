import { BadRequestException, Injectable } from '@nestjs/common';
import { resolvePagination } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import type { RemarkItem, RemarkListQuery, RemarkObjectType } from './remarks.types.js';

type RemarkSourceField = 'remark' | 'description';

interface RemarkSourceRow {
  id: string;
  objectType: RemarkObjectType;
  objectTypeLabel: string;
  code?: string | null;
  name: string;
  content?: string | null;
  sourceField: RemarkSourceField;
  updatedAt?: Date | null;
  routeName?: string;
  routeParams?: Record<string, string>;
  managementRouteName?: string;
  subType?: string;
}

const OBJECT_TYPE_LABELS: Record<RemarkObjectType, string> = {
  PLAYER: '球员',
  COUNTRY: '国家',
  CLUB: '俱乐部',
  COMPETITION: '赛事',
  AWARD: '奖项',
  CITY: '城市',
  BASE_CONFIG: '基础配置'
};

const OBJECT_TYPES = new Set<RemarkObjectType>(
  Object.keys(OBJECT_TYPE_LABELS) as RemarkObjectType[]
);

@Injectable()
export class RemarksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: RemarkListQuery) {
    const pagination = resolvePagination(query);
    const objectType = this.parseObjectType(query.objectType);
    const hasRemark = this.parseHasRemark(query.hasRemark);
    const keyword = query.keyword?.trim().toLowerCase();
    const items = (await this.collectRows(objectType))
      .map((item) => this.toRemarkItem(item))
      .filter((item) => this.matchHasRemark(item, hasRemark))
      .filter((item) => this.matchKeyword(item, keyword))
      .sort((a, b) => this.sortRemarks(a, b));

    return {
      items: items.slice(pagination.skip, pagination.skip + pagination.take),
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: items.length
    };
  }

  private async collectRows(objectType?: RemarkObjectType) {
    const requested = (type: RemarkObjectType) => !objectType || objectType === type;
    const groups: Array<Promise<RemarkSourceRow[]>> = [];

    if (requested('PLAYER')) {
      groups.push(this.collectPlayers());
    }

    if (requested('COUNTRY')) {
      groups.push(this.collectCountries());
    }

    if (requested('CLUB')) {
      groups.push(this.collectClubs());
    }

    if (requested('COMPETITION')) {
      groups.push(this.collectCompetitions());
    }

    if (requested('AWARD')) {
      groups.push(this.collectAwards());
    }

    if (requested('CITY')) {
      groups.push(this.collectCities());
    }

    if (requested('BASE_CONFIG')) {
      groups.push(this.collectBaseConfigs());
    }

    return (await Promise.all(groups)).flat();
  }

  private async collectPlayers(): Promise<RemarkSourceRow[]> {
    const rows = await this.prisma.player.findMany({
      select: {
        id: true,
        uid: true,
        chineseName: true,
        englishName: true,
        remark: true,
        updatedAt: true
      }
    });

    return rows.map((row) => ({
      id: row.id,
      objectType: 'PLAYER',
      objectTypeLabel: OBJECT_TYPE_LABELS.PLAYER,
      code: row.uid,
      name: row.chineseName || row.englishName || row.uid,
      content: row.remark,
      sourceField: 'remark',
      updatedAt: row.updatedAt,
      routeName: 'stars-detail-id',
      routeParams: { id: row.id }
    }));
  }

  private async collectCountries(): Promise<RemarkSourceRow[]> {
    const rows = await this.prisma.country.findMany({
      select: {
        id: true,
        uid: true,
        name: true,
        remark: true,
        updatedAt: true
      }
    });

    return rows.map((row) => ({
      id: row.id,
      objectType: 'COUNTRY',
      objectTypeLabel: OBJECT_TYPE_LABELS.COUNTRY,
      code: row.uid,
      name: row.name,
      content: row.remark,
      sourceField: 'remark',
      updatedAt: row.updatedAt,
      routeName: 'nations-detail-id',
      routeParams: { id: row.id }
    }));
  }

  private async collectClubs(): Promise<RemarkSourceRow[]> {
    const rows = await this.prisma.club.findMany({
      select: {
        id: true,
        uid: true,
        name: true,
        remark: true,
        updatedAt: true
      }
    });

    return rows.map((row) => ({
      id: row.id,
      objectType: 'CLUB',
      objectTypeLabel: OBJECT_TYPE_LABELS.CLUB,
      code: row.uid,
      name: row.name,
      content: row.remark,
      sourceField: 'remark',
      updatedAt: row.updatedAt,
      routeName: 'clubs-detail-id',
      routeParams: { id: row.id }
    }));
  }

  private async collectCompetitions(): Promise<RemarkSourceRow[]> {
    const rows = await this.prisma.competition.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        updatedAt: true
      }
    });

    return rows.map((row) => ({
      id: row.id,
      objectType: 'COMPETITION',
      objectTypeLabel: OBJECT_TYPE_LABELS.COMPETITION,
      code: row.code,
      name: row.name,
      content: row.description,
      sourceField: 'description',
      updatedAt: row.updatedAt,
      managementRouteName: 'tianji-competitions'
    }));
  }

  private async collectAwards(): Promise<RemarkSourceRow[]> {
    const rows = await this.prisma.award.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        updatedAt: true
      }
    });

    return rows.map((row) => ({
      id: row.id,
      objectType: 'AWARD',
      objectTypeLabel: OBJECT_TYPE_LABELS.AWARD,
      code: row.code,
      name: row.name,
      content: row.description,
      sourceField: 'description',
      updatedAt: row.updatedAt,
      managementRouteName: 'tianji-awards'
    }));
  }

  private async collectCities(): Promise<RemarkSourceRow[]> {
    const rows = await this.prisma.city.findMany({
      select: {
        id: true,
        uid: true,
        name: true,
        description: true,
        updatedAt: true,
        country: {
          select: {
            name: true
          }
        }
      }
    });

    return rows.map((row) => ({
      id: row.id,
      objectType: 'CITY',
      objectTypeLabel: OBJECT_TYPE_LABELS.CITY,
      code: row.uid,
      name: row.country?.name ? `${row.name}（${row.country.name}）` : row.name,
      content: row.description,
      sourceField: 'description',
      updatedAt: row.updatedAt,
      managementRouteName: 'tianji-base',
      subType: '城市'
    }));
  }

  private async collectBaseConfigs(): Promise<RemarkSourceRow[]> {
    const [positions, playerTypes, potentialRanges, ethnicities, hairColors, preferredFeet] =
      await Promise.all([
        this.prisma.position.findMany({
          select: { id: true, code: true, name: true, description: true, updatedAt: true }
        }),
        this.prisma.playerType.findMany({
          select: { id: true, code: true, name: true, description: true, updatedAt: true }
        }),
        this.prisma.potentialRange.findMany({
          select: { id: true, code: true, name: true, description: true, updatedAt: true }
        }),
        this.prisma.ethnicity.findMany({
          select: { id: true, code: true, name: true, description: true, updatedAt: true }
        }),
        this.prisma.hairColor.findMany({
          select: { id: true, code: true, name: true, description: true, updatedAt: true }
        }),
        this.prisma.preferredFoot.findMany({
          select: { id: true, code: true, name: true, description: true, updatedAt: true }
        })
      ]);

    return [
      ...positions.map((row) => this.toBaseConfigRow(row, '位置')),
      ...playerTypes.map((row) => this.toBaseConfigRow(row, '球员类型')),
      ...potentialRanges.map((row) => this.toBaseConfigRow(row, '潜力范围')),
      ...ethnicities.map((row) => this.toBaseConfigRow(row, '种族')),
      ...hairColors.map((row) => this.toBaseConfigRow(row, '发色')),
      ...preferredFeet.map((row) => this.toBaseConfigRow(row, '惯用脚'))
    ];
  }

  private toBaseConfigRow(
    row: {
      id: string;
      code: string;
      name: string | null;
      description: string | null;
      updatedAt: Date;
    },
    subType: string
  ): RemarkSourceRow {
    return {
      id: row.id,
      objectType: 'BASE_CONFIG',
      objectTypeLabel: OBJECT_TYPE_LABELS.BASE_CONFIG,
      code: row.code,
      name: row.name ? `${row.name}（${subType}）` : `${row.code}（${subType}）`,
      content: row.description,
      sourceField: 'description',
      updatedAt: row.updatedAt,
      managementRouteName: 'tianji-base',
      subType
    };
  }

  private toRemarkItem(row: RemarkSourceRow): RemarkItem {
    return {
      id: `${row.objectType}:${row.id}:${row.sourceField}`,
      objectType: row.objectType,
      objectTypeLabel: row.objectTypeLabel,
      objectId: row.id,
      code: row.code,
      name: row.name,
      content: row.content?.trim() ?? '',
      sourceField: row.sourceField,
      updatedAt: row.updatedAt,
      routeName: row.routeName,
      routeParams: row.routeParams,
      managementRouteName: row.managementRouteName,
      subType: row.subType
    };
  }

  private parseObjectType(value?: RemarkObjectType) {
    if (!value) {
      return undefined;
    }

    if (!OBJECT_TYPES.has(value)) {
      throw new BadRequestException('备注对象类型不合法。');
    }

    return value;
  }

  private parseHasRemark(value?: string) {
    if (value === 'all') {
      return undefined;
    }

    if (value === 'false') {
      return false;
    }

    return true;
  }

  private matchHasRemark(item: RemarkItem, hasRemark?: boolean) {
    if (hasRemark === undefined) {
      return true;
    }

    return hasRemark ? Boolean(item.content) : !item.content;
  }

  private matchKeyword(item: RemarkItem, keyword?: string) {
    if (!keyword) {
      return true;
    }

    return [item.objectTypeLabel, item.subType, item.code, item.name, item.content]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
  }

  private sortRemarks(a: RemarkItem, b: RemarkItem) {
    const byUpdatedAt = (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0);

    if (byUpdatedAt !== 0) {
      return byUpdatedAt;
    }

    return a.name.localeCompare(b.name, 'zh-CN');
  }
}
