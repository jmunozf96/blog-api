export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export function getPaginationParams(query: any): PaginationParams {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  return { page, limit };
}