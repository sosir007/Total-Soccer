import { ApiPrefix } from '../api-prefix';
import { api } from '../api';
import type {
  AwardDetail,
  AwardEdition,
  AwardListItem,
  AwardListParams,
  AwardRecipientListParams,
  AwardRecipientRecord,
  CreateAwardEditionPayload,
  CreateAwardPayload,
  SaveAwardRecipientsPayload
} from '../types/awards';
import type { PaginationResult } from '../types/common';

const prefix = ApiPrefix.AWARDS;
const editionPrefix = ApiPrefix.AWARD_EDITIONS;

const API = {
  LIST: prefix,
  RECIPIENTS: `${prefix}/recipients`,
  DETAIL: (id: string) => `${prefix}/${id}`,
  EDITIONS: (awardId: string) => `${prefix}/${awardId}/editions`,
  EDITION_DETAIL: (id: string) => `${editionPrefix}/${id}`,
  EDITION_RECIPIENTS: (id: string) => `${editionPrefix}/${id}/recipients`
} as const;

export async function fetchAwards(params: AwardListParams) {
  const response = await api.get<PaginationResult<AwardListItem>>(API.LIST, {
    params
  });

  return response;
}

export async function fetchAwardRecipients(params: AwardRecipientListParams) {
  const response = await api.get<PaginationResult<AwardRecipientRecord>>(API.RECIPIENTS, {
    params
  });

  return response;
}

export async function fetchAwardDetail(id: string) {
  const response = await api.get<AwardDetail>(API.DETAIL(id));

  return response;
}

export async function createAward(payload: CreateAwardPayload) {
  const response = await api.post<AwardListItem>(API.LIST, payload);

  return response;
}

export async function updateAward(id: string, payload: CreateAwardPayload) {
  const response = await api.put<AwardListItem>(API.DETAIL(id), payload);

  return response;
}

export async function createAwardEdition(id: string, payload: CreateAwardEditionPayload) {
  const response = await api.post<AwardEdition>(API.EDITIONS(id), payload);

  return response;
}

export async function updateAwardEdition(id: string, payload: CreateAwardEditionPayload) {
  const response = await api.put<AwardEdition>(API.EDITION_DETAIL(id), payload);

  return response;
}

export async function saveAwardRecipients(id: string, payload: SaveAwardRecipientsPayload) {
  const response = await api.put<AwardEdition>(API.EDITION_RECIPIENTS(id), payload);

  return response;
}
