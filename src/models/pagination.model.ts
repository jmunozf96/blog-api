export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginationResult<T> {
  data: T[];
  meta: PaginationMeta;
}
