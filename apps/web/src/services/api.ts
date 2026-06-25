import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig
} from 'axios';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string | string[];
  statusCode: number;
  path: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
export type ApiErrorType = 'business' | 'http' | 'network' | 'timeout' | 'canceled' | 'unknown';

export interface ApiRequestConfig<
  Data = unknown,
  Result = unknown
> extends AxiosRequestConfig<Data> {
  skipErrorNormalize?: boolean;
  transformRequestData?: (data: Data | undefined) => unknown;
  transformResponseData?: (data: Result) => Result;
}

interface InternalApiRequestConfig extends InternalAxiosRequestConfig {
  skipErrorNormalize?: boolean;
}

export class ApiError extends Error {
  readonly code: string;
  readonly statusCode?: number;
  readonly path?: string;
  readonly timestamp?: string;
  readonly type: ApiErrorType;
  readonly raw: unknown;

  constructor(options: {
    message: string;
    code: string;
    statusCode?: number;
    path?: string;
    timestamp?: string;
    type: ApiErrorType;
    raw?: unknown;
  }) {
    super(options.message);
    this.name = 'ApiError';
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.path = options.path;
    this.timestamp = options.timestamp;
    this.type = options.type;
    this.raw = options.raw;
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:9249',
  timeout: 30000,
  withCredentials: true,
  headers: {
    Accept: 'application/json'
  }
});

function normalizeMessage(message: string | string[] | undefined) {
  if (Array.isArray(message)) {
    return message.join('；');
  }

  return message || '请求失败，请稍后重试。';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isApiSuccessResponse<T>(value: unknown): value is ApiSuccessResponse<T> {
  return isRecord(value) && value.success === true && 'data' in value;
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    isRecord(value) &&
    value.success === false &&
    isRecord(value.error) &&
    typeof value.error.code === 'string'
  );
}

function normalizeParams(params: unknown) {
  if (!isRecord(params)) {
    return params;
  }

  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));
}

function resolveAuthToken() {
  try {
    return window.localStorage.getItem('TOTAL_SOCCER_TOKEN') || '';
  } catch {
    return '';
  }
}

function unwrapResponse<T>(data: unknown): T {
  if (isApiSuccessResponse<T>(data)) {
    return data.data;
  }

  if (isApiErrorResponse(data)) {
    throw new ApiError({
      message: normalizeMessage(data.error.message),
      code: data.error.code,
      statusCode: data.error.statusCode,
      path: data.error.path,
      timestamp: data.error.timestamp,
      type: 'business',
      raw: data
    });
  }

  return data as T;
}

function createHttpError(error: AxiosError<ApiErrorResponse>) {
  const payload = error.response?.data;

  if (isApiErrorResponse(payload)) {
    return new ApiError({
      message: normalizeMessage(payload.error.message),
      code: payload.error.code,
      statusCode: payload.error.statusCode,
      path: payload.error.path,
      timestamp: payload.error.timestamp,
      type: payload.error.statusCode >= 400 ? 'http' : 'business',
      raw: error
    });
  }

  return new ApiError({
    message: error.response?.statusText || error.message || 'HTTP 请求失败。',
    code: `HTTP_${error.response?.status ?? 'ERROR'}`,
    statusCode: error.response?.status,
    path: error.config?.url,
    type: 'http',
    raw: error
  });
}

export function normalizeApiError(error: unknown) {
  if (error instanceof ApiError) {
    return error;
  }

  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return new ApiError({
      message: error instanceof Error ? error.message : '未知请求错误。',
      code: 'UNKNOWN_ERROR',
      type: 'unknown',
      raw: error
    });
  }

  if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
    return new ApiError({
      message: '请求已取消。',
      code: 'REQUEST_CANCELED',
      path: error.config?.url,
      type: 'canceled',
      raw: error
    });
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new ApiError({
      message: '请求超时，请稍后重试。',
      code: 'REQUEST_TIMEOUT',
      path: error.config?.url,
      type: 'timeout',
      raw: error
    });
  }

  if (!error.response) {
    return new ApiError({
      message: '网络连接异常，请检查后端服务是否可用。',
      code: 'NETWORK_ERROR',
      path: error.config?.url,
      type: 'network',
      raw: error
    });
  }

  return createHttpError(error);
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getErrorMessage(error: unknown) {
  return isApiError(error)
    ? error.message
    : error instanceof Error
      ? error.message
      : '操作失败，请稍后重试。';
}

apiClient.interceptors.request.use((config: InternalApiRequestConfig) => {
  config.params = normalizeParams(config.params);
  const token = resolveAuthToken();

  if (token && !config.headers.has('Authorization')) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => unwrapResponse(response.data),
  (error: unknown) => {
    const config = axios.isAxiosError(error)
      ? (error.config as InternalApiRequestConfig | undefined)
      : undefined;

    return Promise.reject(config?.skipErrorNormalize ? error : normalizeApiError(error));
  }
);

export async function request<Result = unknown, Data = unknown>(
  config: ApiRequestConfig<Data, Result>
) {
  const { transformRequestData, transformResponseData, ...axiosConfig } = config;
  const requestData = transformRequestData
    ? transformRequestData(axiosConfig.data)
    : axiosConfig.data;
  const result = await apiClient.request<unknown, Result, Data>({
    ...axiosConfig,
    data: requestData as Data
  });

  return transformResponseData ? transformResponseData(result) : result;
}

export function get<Result = unknown>(url: string, config?: ApiRequestConfig<never, Result>) {
  return request<Result, never>({
    ...config,
    method: 'GET',
    url
  });
}

export function post<Result = unknown, Data = unknown>(
  url: string,
  data?: Data,
  config?: ApiRequestConfig<Data, Result>
) {
  return request<Result, Data>({
    ...config,
    method: 'POST',
    url,
    data
  });
}

export function put<Result = unknown, Data = unknown>(
  url: string,
  data?: Data,
  config?: ApiRequestConfig<Data, Result>
) {
  return request<Result, Data>({
    ...config,
    method: 'PUT',
    url,
    data
  });
}

export function deleteRequest<Result = unknown>(
  url: string,
  config?: ApiRequestConfig<never, Result>
) {
  return request<Result, never>({
    ...config,
    method: 'DELETE',
    url
  });
}

export function upload<Result = unknown>(
  url: string,
  data: FormData,
  config?: ApiRequestConfig<FormData, Result>
) {
  return post<Result, FormData>(url, data, {
    ...config,
    headers: {
      ...config?.headers,
      'Content-Type': 'multipart/form-data'
    }
  });
}

export const api = {
  request,
  get,
  post,
  put,
  delete: deleteRequest,
  upload
};
