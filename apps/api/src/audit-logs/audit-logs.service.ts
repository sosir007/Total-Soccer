import { BadRequestException, Injectable } from '@nestjs/common';
import { AuditAction, type Prisma } from '@prisma/client';
import { resolvePagination } from '../common/pagination.js';
import { PrismaService } from '../database/prisma.service.js';
import type { AuditLogListQuery } from './audit-logs.types.js';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: AuditLogListQuery) {
    const pagination = resolvePagination(query);
    const where = this.buildWhere(query);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.auditLog.count({ where })
    ]);

    return {
      items,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total
    };
  }

  private buildWhere(query: AuditLogListQuery): Prisma.AuditLogWhereInput {
    const keyword = query.keyword?.trim();

    return {
      ...(keyword
        ? {
            OR: [
              { module: { contains: keyword, mode: 'insensitive' } },
              { method: { contains: keyword, mode: 'insensitive' } },
              { path: { contains: keyword, mode: 'insensitive' } },
              { objectType: { contains: keyword, mode: 'insensitive' } },
              { objectId: { contains: keyword, mode: 'insensitive' } },
              { summary: { contains: keyword, mode: 'insensitive' } },
              { actor: { contains: keyword, mode: 'insensitive' } },
              { ip: { contains: keyword, mode: 'insensitive' } },
              { userAgent: { contains: keyword, mode: 'insensitive' } }
            ]
          }
        : {}),
      ...(query.module ? { module: { contains: query.module.trim(), mode: 'insensitive' } } : {}),
      ...(query.action ? { action: this.parseAction(query.action) } : {}),
      ...(query.success === undefined ? {} : { success: query.success === 'true' })
    };
  }

  private parseAction(value: AuditAction) {
    if (!Object.values(AuditAction).includes(value)) {
      throw new BadRequestException('审计操作类型不合法。');
    }

    return value;
  }
}
