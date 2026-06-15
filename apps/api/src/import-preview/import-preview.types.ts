export type ImportSourceType = 'lakesheet' | 'excel' | 'csv';

export interface UploadedImportFile {
  originalname: string;
  size: number;
  buffer: Buffer;
}

export interface ImportPreviewError {
  sheetName?: string;
  rowNumber?: number;
  fieldName?: string;
  code: string;
  message: string;
  rawValue?: string;
}

export interface ImportPreviewSheet {
  name: string;
  rowCount: number;
  columnCount: number;
  headers: string[];
  sampleRows: Record<string, unknown>[];
}

export interface ParsedSheet {
  name: string;
  rows: unknown[][];
}

export interface ImportPreviewResult {
  task: {
    id: string;
    fileName: string;
    fileType: string;
    sourceType: ImportSourceType;
    status: string;
    totalRows: number;
    failedRows: number;
    createdAt: Date;
  };
  summary: {
    sheetCount: number;
    totalRows: number;
    errorCount: number;
  };
  sheets: ImportPreviewSheet[];
  errors: ImportPreviewError[];
}
