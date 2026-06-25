import { ApiPrefix } from '../api-prefix';
import { api } from '../api';
import type { ImportConfirmResult, ImportPreviewResult } from '../types/importPreview';

const prefix = ApiPrefix.IMPORT_PREVIEW;

const API = {
  PREVIEW: prefix,
  CONFIRM: (taskId: string) => `${prefix}/${taskId}/confirm`
} as const;

export async function createImportPreview(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.upload<ImportPreviewResult>(API.PREVIEW, formData);

  return response;
}

export async function confirmImportPreview(taskId: string) {
  const response = await api.post<ImportConfirmResult>(API.CONFIRM(taskId));

  return response;
}
