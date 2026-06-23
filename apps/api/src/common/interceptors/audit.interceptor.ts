import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { AuditAction, type Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { PrismaService } from '../../database/prisma.service.js';

const LOCAL_ACTOR = 'LOCAL_USER';
const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    if (!this.shouldAudit(request)) {
      return next.handle();
    }

    const startedAt = Date.now();

    return next.handle().pipe(
      tap((data) => {
        void this.writeLog(request, {
          response,
          data,
          success: true,
          durationMs: Date.now() - startedAt
        });
      }),
      catchError((error: unknown) => {
        void this.writeLog(request, {
          response,
          error,
          success: false,
          durationMs: Date.now() - startedAt
        });

        return throwError(() => error);
      })
    );
  }

  private shouldAudit(request: Request) {
    if (!WRITE_METHODS.has(request.method)) {
      return false;
    }

    return !this.cleanPath(request).startsWith('/audit-logs');
  }

  private async writeLog(
    request: Request,
    options: {
      response: Response;
      data?: unknown;
      error?: unknown;
      success: boolean;
      durationMs: number;
    }
  ) {
    try {
      const path = this.cleanPath(request);
      const route = this.resolveRoute(path, request.method);
      const statusCode = options.success
        ? options.response.statusCode
        : this.resolveErrorStatus(options.error, options.response.statusCode);

      await this.prisma.auditLog.create({
        data: {
          action: route.action,
          module: route.module,
          method: request.method,
          path,
          success: options.success,
          statusCode,
          objectType: route.objectType,
          objectId: this.resolveObjectId(request, options.data),
          summary: this.buildSummary(route, request, options.success),
          actor: LOCAL_ACTOR,
          ip: request.ip,
          userAgent: request.get('user-agent'),
          metadata: this.buildMetadata(request, options)
        }
      });
    } catch (error) {
      this.logger.warn(
        `审计日志写入失败：${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private resolveRoute(path: string, method: string) {
    const segments = path.split('/').filter(Boolean);
    const resource = segments[0] ?? 'unknown';
    const tail = segments[segments.length - 1] ?? '';
    const isRecalculate = tail === 'recalculate';
    const isImport = resource.startsWith('import') || path.includes('/import');

    return {
      module: this.moduleLabel(resource),
      action: this.resolveAction(method, isRecalculate, isImport),
      objectType: this.objectTypeLabel(resource)
    };
  }

  private resolveAction(method: string, isRecalculate: boolean, isImport: boolean) {
    if (isRecalculate) {
      return AuditAction.RECALCULATE;
    }

    if (isImport) {
      return AuditAction.IMPORT;
    }

    if (method === 'POST') {
      return AuditAction.CREATE;
    }

    if (method === 'PUT' || method === 'PATCH') {
      return AuditAction.UPDATE;
    }

    return AuditAction.OTHER;
  }

  private moduleLabel(resource: string) {
    const labels: Record<string, string> = {
      players: '球员资料',
      countries: '国家资料',
      clubs: '俱乐部资料',
      competitions: '赛事管理',
      awards: '奖项管理',
      'award-editions': '奖项年份',
      'honor-rules': '荣誉规则',
      'award-rules': '球员奖项规则',
      'base-config': '基础配置',
      'import-preview': '数据导入',
      remarks: '备注管理'
    };

    return labels[resource] ?? resource;
  }

  private objectTypeLabel(resource: string) {
    const labels: Record<string, string> = {
      players: 'PLAYER',
      countries: 'COUNTRY',
      clubs: 'CLUB',
      competitions: 'COMPETITION',
      awards: 'AWARD',
      'award-editions': 'AWARD_EDITION',
      'honor-rules': 'HONOR_RULE',
      'award-rules': 'AWARD_RULE',
      'base-config': 'BASE_CONFIG',
      'import-preview': 'IMPORT_TASK'
    };

    return labels[resource] ?? resource.toUpperCase();
  }

  private resolveObjectId(request: Request, data?: unknown) {
    const params = request.params as Record<string, string | undefined>;

    return params.id ?? this.pickId(data);
  }

  private pickId(data: unknown): string | undefined {
    if (!data || typeof data !== 'object') {
      return undefined;
    }

    const id = (data as { id?: unknown }).id;

    return typeof id === 'string' ? id : undefined;
  }

  private buildSummary(
    route: { module: string; action: AuditAction },
    request: Request,
    success: boolean
  ) {
    const actionLabels: Record<AuditAction, string> = {
      CREATE: '创建',
      UPDATE: '编辑',
      RECALCULATE: '重算',
      IMPORT: '导入',
      UPSERT: '写入',
      OTHER: '操作'
    };

    return `${success ? '成功' : '失败'}${actionLabels[route.action]}${route.module}：${request.method} ${this.cleanPath(request)}`;
  }

  private buildMetadata(
    request: Request,
    options: {
      error?: unknown;
      durationMs: number;
    }
  ): Prisma.InputJsonObject {
    const bodySummary = this.summarizeBody(request.body);
    const errorMessage = options.error instanceof Error ? options.error.message : undefined;

    return {
      durationMs: options.durationMs,
      params: request.params,
      query: request.query as Prisma.InputJsonObject,
      body: bodySummary,
      errorMessage
    };
  }

  private summarizeBody(body: unknown): Prisma.InputJsonValue {
    if (!body || typeof body !== 'object') {
      return {};
    }

    const source = body as Record<string, unknown>;
    const result: Record<string, Prisma.InputJsonValue> = {};

    for (const [key, value] of Object.entries(source)) {
      if (key.toLowerCase().includes('file') || key.toLowerCase().includes('password')) {
        result[key] = '[redacted]';
        continue;
      }

      if (typeof value === 'string') {
        result[key] = value.length > 120 ? `${value.slice(0, 120)}...` : value;
        continue;
      }

      if (typeof value === 'number' || typeof value === 'boolean') {
        result[key] = value;
        continue;
      }

      if (value === null) {
        result[key] = '[null]';
        continue;
      }

      if (Array.isArray(value)) {
        result[key] = `[array:${value.length}]`;
        continue;
      }

      result[key] = '[object]';
    }

    return result;
  }

  private resolveErrorStatus(error: unknown, fallback: number) {
    const status = (error as { status?: unknown })?.status;

    return typeof status === 'number' ? status : fallback || 500;
  }

  private cleanPath(request: Request) {
    return (request.originalUrl || request.url).split('?')[0] || '/';
  }
}
