import { apiClient, type ApiResponse } from './api';

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

export async function createImportPreview(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<ApiResponse<ImportPreviewResult>>(
    '/import-preview',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data.data;
}
