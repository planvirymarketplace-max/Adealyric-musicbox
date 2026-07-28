/**
 * Utility to ensure React Query data is always a plain array.
 *
 * Problem: mock-fallback.ts wraps list endpoints in PaginatedResponse { data, pagination },
 * and some hooks declare useQuery<SomeType[]> expecting a plain array. If the unwrap in
 * api-client.ts doesn't fully catch the mismatch, query.data could be a PaginatedResponse
 * object instead of an array, causing .filter/.map TypeError crashes in components.
 *
 * This helper defensively extracts the inner array from PaginatedResponse, or falls back
 * to the provided mock array if query.data is neither an array nor a valid PaginatedResponse.
 */
export function ensureArray<T>(
  queryData: unknown,
  mockFallback: T[],
): T[] {
  if (Array.isArray(queryData)) return queryData as T[];
  if (
    queryData !== null &&
    queryData !== undefined &&
    typeof queryData === 'object' &&
    'data' in queryData &&
    Array.isArray((queryData as { data: unknown }).data)
  ) {
    return (queryData as { data: T[] }).data;
  }
  return mockFallback;
}
