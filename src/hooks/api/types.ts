import type { UserTableType as User } from "@/db";

export interface ApiResponse<T = unknown> {
	data: T;
	status: number;
	message?: string;
}

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public code?: string,
	) {
		super(message);
		this.name = 'ApiError';
	}
}

export interface ApiErrorInterface {
	message: string;
	status: number;
	code?: string;
}

export interface RouteDefinition {
	method: HttpMethod;
	response: unknown;
	params?: Record<string, unknown>;
	body?: unknown;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
	method?: HttpMethod;
	headers?: Record<string, string>;
	body?: unknown;
	params?: Record<string, unknown>;
}

export interface UseApiState<T> {
	data: T | null;
	loading: boolean;
	error: ApiError | null;
}

export interface UseApiReturn<T> extends UseApiState<T> {
	refetch: () => Promise<void>;
	mutate: (newData: T) => void;
}

export interface ApiRoutes {
  users: {
    '/users': {
      GET: {
        response: User[];
        params?: { page?: number; limit?: number };
      };
      POST: {
        response: { id: number; name: string; email: string };
        body: { name: string; email: string };
      };
    };
    '/users/:id': {
      GET: {
        response: User;
        params: { id: number };
      };
      PATCH: {
        response: User;
        params: { id: number };
        body: Partial<User>;
      };
      DELETE: {
        response: { success: boolean };
        params: { id: number };
      };
    };
  };
}


// Utilitaires de types
export type ExtractResponse<T> = T extends { response: infer R } ? R : never;
export type ExtractParams<T> = T extends { params: infer P } ? P : never;
export type ExtractBody<T> = T extends { body: infer B } ? B : never;

export type RouteKey = keyof ApiRoutes;
export type PathKey<R extends RouteKey> = keyof ApiRoutes[R];
export type MethodKey<
  R extends RouteKey,
  P extends PathKey<R>,
> = keyof ApiRoutes[R][P];

export type RouteEndpoint<
  R extends RouteKey,
  P extends PathKey<R>,
  M extends MethodKey<R, P>,
> = ApiRoutes[R][P][M];
