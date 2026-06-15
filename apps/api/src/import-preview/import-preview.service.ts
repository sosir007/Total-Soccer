import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { inflateSync } from 'node:zlib';
import * as XLSX from 'xlsx';
import type {
  ImportPreviewError,
  ImportPreviewResult,
  ImportPreviewSheet,
  ImportSourceType,
  ParsedSheet,
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

      if (errors.length > 0) {
        await this.prisma.importError.createMany({
          data: errors.map((error) => ({
            taskId: task.id,
            sheetName: error.sheetName,
            rowNumber: error.rowNumber,
            fieldName: error.fieldName,
            code: error.code,
            message: error.message,
            rawValue: error.rawValue
          }))
        });
      }

      const updatedTask = await this.prisma.importTask.update({
        where: { id: task.id },
        data: {
          status,
          totalRows,
          failedRows: errors.length,
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

      await this.prisma.importError.create({
        data: {
          taskId: task.id,
          code: 'PARSE_FAILED',
          message
        }
      });
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
        errors.push({
          sheetName: sheet.name,
          rowNumber,
          fieldName: 'UID',
          code: 'EMPTY_UID',
          message: `${sheet.name} 第 ${rowNumber} 行 UID 为空。`
        });
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
