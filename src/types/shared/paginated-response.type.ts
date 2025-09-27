export type PaginatedResponse<T> = {
  items: T[];
  totalItemsCount: number;
  totalPagesCount: number;
};
