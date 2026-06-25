import { ApiPrefix } from '../api-prefix';
import { api } from '../api';
import type { PaginationResult } from '../types/common';
import type { RemarkItem, RemarkListParams } from '../types/remarks';

const prefix = ApiPrefix.REMARKS;

const API = {
  LIST: prefix
} as const;

export async function fetchRemarks(params: RemarkListParams) {
  const response = await api.get<PaginationResult<RemarkItem>>(API.LIST, {
    params
  });

  return response;
}
