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

export interface ImportPreviewResult {
  task: {
    id: string;
    fileName: string;
    fileType: string;
    sourceType: string;
    status: string;
    totalRows: number;
    failedRows: number;
    createdAt: string;
  };
  summary: {
    sheetCount: number;
    totalRows: number;
    errorCount: number;
  };
  sheets: ImportPreviewSheet[];
  errors: ImportPreviewError[];
}

export interface ImportConfirmResult {
  task: {
    id: string;
    status: string;
    successRows: number;
    failedRows: number;
  };
  imported: {
    countries: number;
    clubs: number;
    players: number;
    positions: number;
    playerTypes: number;
    confederations: number;
    potentialRanges: number;
    ethnicities: number;
    hairColors: number;
    preferredFeet: number;
  };
  skipped: number;
  errors: ImportPreviewError[];
}
