/** biome-ignore-all lint/suspicious/noExplicitAny: Need generic from complex type*/
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ApiError,
  type ApiResponse,
  type ExtractBody,
  type ExtractParams,
  type ExtractResponse,
  type HttpMethod,
  type MethodKey,
  type PathKey,
  type RequestConfig,
  type RouteEndpoint,
  type RouteKey,
  type UseApiReturn,
} from './types';

class ApiClient {
  private defaultHeaders: Record<string, string>;

  constructor(private baseURL: string = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  setBaseURL(url: string) {
    this.baseURL = url;
  }

  setDefaultHeaders(headers: Record<string, string>) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  setAuthToken(token: string) {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  async request<T>(
    path: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', headers = {}, body, params } = config;

    const url = this.buildURL(
      this.interpolatePath(path, params),
      method === 'GET' ? params : undefined
    );

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: 'include',
      redirect: 'manual',
    };

    if (body && method !== 'GET') {
      requestConfig.body =
        typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestConfig);

      if (!response.ok) {
        const errorData: { message?: string; code?: string } = await response
          .json()
          .catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP Error: ${response.status}`,
          response.status,
          errorData.code
        );
      }

      if (response.status >= 301 && response.status <= 307) {
        const location = response.headers.get('Location');
        if (location) {
          window.location.href = location;
        }
      }

      const data: T = await response.json();

      return {
        data,
        status: response.status,
        message:
          typeof data === 'object' && data !== null && 'message' in data
            ? (data as { message?: string }).message
            : undefined,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new ApiError(error.message, 0);
      }
      throw new ApiError('Unknown error occurred', 0);
    }
  }

  // Typed method for the routes
  private buildURL(path: string, params?: Record<string, unknown>) {
    let url = `${this.baseURL}${path}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const query = searchParams.toString();
      if (query) {
        url += `?${query}`;
      }
    }
    return url;
  }

  private interpolatePath(path: string, params?: Record<string, any>) {
    if (!params) {
      return path;
    }
    return path.replace(/:([a-zA-Z]+)/g, (_, key) => params[key] ?? `:${key}`);
  }

  async call<
    R extends RouteKey,
    P extends PathKey<R>,
    M extends MethodKey<R, P>,
  >(
    _route: R,
    path: P,
    method: M,
    options?: {
      params?: ExtractParams<RouteEndpoint<R, P, M>>;
      body?: ExtractBody<RouteEndpoint<R, P, M>>;
      headers?: Record<string, string>;
    }
  ): Promise<ApiResponse<ExtractResponse<RouteEndpoint<R, P, M>>>> {
    return this.request(path as string, {
      ...(options as RequestConfig),
      method: method as HttpMethod,
    });
  }
}

// Global Instance
export const apiClient = new ApiClient();

export function useApi<
  R extends RouteKey,
  P extends PathKey<R>,
  M extends MethodKey<R, P>,
>(
  route: R,
  path: P,
  method: M,
  options?: {
    params?: ExtractParams<RouteEndpoint<R, P, M>>;
    body?: ExtractBody<RouteEndpoint<R, P, M>>;
    immediate?: boolean;
    dependencies?: unknown[];
  }
): UseApiReturn<ExtractResponse<RouteEndpoint<R, P, M>>> {
  const [data, setData] = useState<ExtractResponse<RouteEndpoint<R, P, M>>>(
    {} as ExtractResponse<RouteEndpoint<R, P, M>>
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.call(route, path, method, {
        params: optionsRef.current?.params,
        body: optionsRef.current?.body,
      });
      setData(response.data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [route, path, method]);

  const mutate = useCallback(
    (newData: ExtractResponse<RouteEndpoint<R, P, M>>) => {
      setData(newData);
    },
    []
  );

  useEffect(() => {
    if (options?.immediate !== false) {
      fetchData();
    }
  }, [fetchData, ...(options?.dependencies || []), options?.immediate]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    mutate,
  };
}

// Hook pour les mutations
export function useApiMutation<
  R extends RouteKey,
  P extends PathKey<R>,
  M extends MethodKey<R, P>,
>(route: R, path: P, method: M) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(
    async (options?: {
      params?: ExtractParams<RouteEndpoint<R, P, M>>;
      body?: ExtractBody<RouteEndpoint<R, P, M>>;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.call(route, path, method, options);
        return response.data;
      } catch (err) {
        setError(err as ApiError);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [route, path, method]
  );

  return {
    mutate,
    loading,
    error,
  };
}
