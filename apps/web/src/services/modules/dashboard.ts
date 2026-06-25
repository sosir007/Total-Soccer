import { ApiPrefix } from '../api-prefix';
import { api } from '../api';
import type { WorldOverview } from '../types/dashboard';

const prefix = ApiPrefix.DASHBOARD;

const API = {
  OVERVIEW: `${prefix}/overview`
} as const;

export async function fetchWorldOverview() {
  const response = await api.get<WorldOverview>(API.OVERVIEW);

  return response;
}
