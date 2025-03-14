import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface PaginationParams {
  limit: number;
  offset: number;
}

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationParams => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const limit = query.limit ? parseInt(query.limit, 10) : 20;
    const offset = query.offset ? parseInt(query.offset, 10) : 0;

    return {
      limit: isNaN(limit) || limit < 1 ? 20 : Math.min(limit, 100), // Giới hạn tối đa là 100
      offset: isNaN(offset) || offset < 0 ? 0 : offset,
    };
  },
);
