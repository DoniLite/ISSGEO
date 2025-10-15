import type { PaginationQuery } from '@/lib/interfaces/pagination';

export default function buildQuery<T extends Record<string, unknown>>(
  query: T
): PaginationQuery {
  const out: PaginationQuery = {};

  for (const [key, value] of Object.entries(query)) {
    if (
      key === 'page' ||
      key === 'pageSize' ||
      key === 'search' ||
      key === 'sortBy' ||
      key === 'sortOrder' ||
      key === 'includeDeleted' ||
      key === 'populateChildren'
    ) {
      // biome-ignore lint/suspicious/noExplicitAny: <>
      out[key] = value as any;
    } else if (value || (typeof value === 'string' && value.length > 2)) {
      out.filters = {
        ...out.filters,
        // biome-ignore lint/suspicious/noExplicitAny: <>
        [key]: value as any,
      };
    }
  }

  return out;
}
