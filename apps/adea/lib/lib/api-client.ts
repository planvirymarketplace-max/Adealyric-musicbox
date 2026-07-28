/**
 * Centralized API client — typed fetch wrapper with auth, error handling, and base URL.
 * All React Query hooks use this singleton for HTTP requests.
 *
 * When the backend is unavailable (no database running), the client falls through
 * to mock data from the mock-fallback registry so that pages render with UI structure
 * instead of showing "Failed to load" error states.
 */

import { getMockFallback } from '@/lib/mock-fallback';

const TOKEN_KEY = 'auth-token';

export type ApiError = {
  error: string;
  code: string;
  status: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
};

/**
 * Heuristic: if mock data looks like a PaginatedResponse { data: Array, pagination: {...} },
 * unwrap it to return just the inner array. This fixes the mismatch where mock-fallback
 * wraps all list endpoints as PaginatedResponse but hooks expect plain SomeType[].
 *
 * Only unwraps when:
 *   - The value has `data` as an Array AND `pagination` as an object
 *   - This prevents accidentally unwrapping real PaginatedResponse that hooks expect
 *     (like useSongs/useReleases which use PaginatedResponse<CatalogSong>)
 *
 * For hooks that explicitly use PaginatedResponse<T>, the apiClient generic T
 * will already be PaginatedResponse and the real API also returns this shape,
 * so the unwrap is safe — those hooks would never enter the catch branch
 * when the real API is working.
 */
function unwrapPaginatedIfArray(mock: unknown): unknown {
  if (
    mock !== null &&
    typeof mock === 'object' &&
    'data' in mock &&
    'pagination' in mock &&
    Array.isArray((mock as PaginatedResponse<unknown>).data) &&
    typeof (mock as PaginatedResponse<unknown>).pagination === 'object'
  ) {
    return (mock as PaginatedResponse<unknown>).data;
  }
  // Not a PaginatedResponse — return as-is (plain arrays, single objects, etc.)
  return mock;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /** Retrieve auth token from localStorage */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  /** Store auth token in localStorage */
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  }

  /** Remove auth token (logout) */
  clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  }

  /** Build headers with optional auth */
  private headers(custom?: Record<string, string>): HeadersInit {
    const h: Record<string, string> = {
      'Content-Type': 'application/json',
      ...custom,
    };
    const token = this.getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  }

  /** Handle non-2xx responses uniformly */
  private async handleError(response: Response): Promise<never> {
    let body: { error?: string; code?: string } = {};
    try { body = await response.json(); } catch { /* ignore parse error */ }

    if (response.status === 401) {
      this.clearToken();
      // DO NOT auto-redirect on 401 — the SPA uses mock auth that doesn't generate JWT tokens,
      // so 401s are expected in development. Let React Query handle the error state gracefully
      // in components (fallback to mock data). Only clear the stale token.
    }

    const apiError: ApiError = {
      error: body.error || response.statusText,
      code: body.code || `HTTP_${response.status}`,
      status: response.status,
    };
    throw apiError;
  }

  /** Generic request method — falls through to mock data when backend is unavailable */
  private async request<T>(
    method: string,
    path: string,
    options?: { body?: unknown; params?: Record<string, string | number | undefined>; headers?: Record<string, string> },
  ): Promise<T> {
    let url = this.baseUrl + path;

    // Append query params
    if (options?.params) {
      const filtered = Object.entries(options.params).filter(([, v]) => v !== undefined) as [string, string][];
      if (filtered.length > 0) {
        url += '?' + filtered.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
      }
    }

    try {
      const res = await fetch(url, {
        method,
        headers: this.headers(options?.headers),
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });

      if (!res.ok) await this.handleError(res);

      // Handle 204 No Content
      if (res.status === 204) return undefined as T;

      return res.json() as Promise<T>;
    } catch (error: unknown) {
      // ── Mock data fallback ──
      // When the backend is unavailable (no DB, network error, auth error),
      // fall through to mock data so pages render with UI structure.
      const mock = getMockFallback(path);
      if (mock !== undefined) {
        console.warn(`[apiClient] Backend unavailable for ${path} — using mock data fallback`);
        // ── Unwrap PaginatedResponse when hook expects a plain array ──
        // The mock-fallback registry wraps all list endpoints in PaginatedResponse,
        // but most hooks declare useQuery<SomeType[]> (expecting a plain array).
        // If the mock returns { data: [...], pagination: {...} } and T is meant
        // to be an array, extract .data so components can call .filter/.map on it.
        const unwrapped = unwrapPaginatedIfArray(mock);
        return unwrapped as T;
      }
      // No mock fallback registered for this path — re-throw the original error
      throw error;
    }
  }

  /** GET request */
  get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
    return this.request<T>('GET', path, { params });
  }

  /** POST request */
  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, { body });
  }

  /** PUT request */
  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, { body });
  }

  /** PATCH request */
  patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PATCH', path, { body });
  }

  /** DELETE request */
  delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }
}

/** Singleton instance used across all hooks */
export const apiClient = new ApiClient();
