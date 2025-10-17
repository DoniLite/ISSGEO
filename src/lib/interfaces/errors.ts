/**
 * Error codes enum matching backend exception codes.
 */
export enum BACKEND_EXCEPTION_CODE {
	ENTITY_NOT_FOUND = "ENTITY_NOT_FOUND",
	AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
	INVALID_ARGUMENT = "INVALID_ARGUMENT",
	METHOD_NOT_SUPPORTED = "METHOD_NOT_SUPPORTED",
	VALIDATION_ERROR = "VALIDATION_ERROR",
	UNAUTHORIZED = "UNAUTHORIZED",
	UNAUTHORIZED_EXCEPTION = "UnauthorizedException",
}

export enum UNEXPECTED_ERROR_CODE {
	UNKNOWN_ERROR_CODE = "UNKNOWN_ERROR_CODE",
	NETWORK_OR_SERVER_ERROR = "NETWORK_OR_SERVER_ERROR",
	UNEXPECTED_FETCH_ERROR = "UNKNOWN_FETCH_ERROR",
	SESSION_EXPIRED_HANDLED = "SESSION_EXPIRED_HANDLED",
	UNKNOWN_STORE_ERROR = "UNKNOWN_STORE_ERROR",
}

/**
 * This module defines types and interfaces for handling API errors in a type-safe manner.
 * It includes structures for error responses, validation errors, and a custom error class.
 */

export interface FetchResponse<T> extends Response {
	_data?: T;
}

/**
 * Structure of a single validation error detail, matching backend's ValidationException details.
 */
export interface ValidationErrorDetail {
	property: string;
	value?: unknown;
	constraints?: Record<string, string>;
	children?: ValidationErrorDetail[];
	message?: string; // Optional human-readable message
}

export interface ApiErrorResponseDetails {
	context: string;
	responseBody?: Record<string, unknown> | ValidationErrorDetail[] | unknown;
	[key: string]: unknown;
}
/**
 * Error response structure returned by the backend API.
 */
export interface ApiErrorResponse {
	statusCode: number;
	code: string;
	message: string;
	description?: string;
	timestamp?: number;
	details?: ApiErrorResponseDetails;
	stackTrace?: string;
}

/**
 * Custom error class to handle API errors in a type-safe way.
 */
export class ApiError extends Error {
	statusCode: number;
	code: string;
	description?: string;
	details?: ApiErrorResponseDetails;
	timestamp?: number;

	constructor(apiErrorResponse: ApiErrorResponse) {
		super(apiErrorResponse.message);
		this.name = "ApiError";
		this.statusCode = apiErrorResponse.statusCode;
		this.code = apiErrorResponse.code;
		this.details = apiErrorResponse.details;
		this.timestamp = apiErrorResponse.timestamp;
		this.description = this.getDescriptionKey(apiErrorResponse);
		this.message = this.getMessageKey(apiErrorResponse);
	}

	// Add toJSON method to make the object serializable during SSR
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			statusCode: this.statusCode,
			code: this.code,
			description: this.description,
			details: this.details
				? JSON.parse(JSON.stringify(this.details))
				: undefined,
			timestamp: this.timestamp,
		};
	}

	isNotFound(): boolean {
		return this.code === BACKEND_EXCEPTION_CODE.ENTITY_NOT_FOUND;
	}

	isAuthenticationError(): boolean {
		return (
			this.code === BACKEND_EXCEPTION_CODE.AUTHENTICATION_FAILED ||
			this.statusCode === 401
		);
	}

	isValidationError(): boolean {
		return this.code === BACKEND_EXCEPTION_CODE.VALIDATION_ERROR;
	}

	isInvalidArgumentError(): boolean {
		return this.code === BACKEND_EXCEPTION_CODE.INVALID_ARGUMENT;
	}

	isUnauthorizedError(): boolean {
		return (
			this.code === BACKEND_EXCEPTION_CODE.UNAUTHORIZED ||
			this.statusCode === 401
		);
	}

	isUnauthorizedException(): boolean {
		return this.code === BACKEND_EXCEPTION_CODE.UNAUTHORIZED_EXCEPTION;
	}

	haveNoMessageOrDescription(): boolean {
		return !this.message?.trim() || !this.description?.trim();
	}

	isUnexpectedError(): boolean {
		return (
			this.code === UNEXPECTED_ERROR_CODE.UNKNOWN_ERROR_CODE ||
			this.code === UNEXPECTED_ERROR_CODE.NETWORK_OR_SERVER_ERROR ||
			this.code === UNEXPECTED_ERROR_CODE.UNEXPECTED_FETCH_ERROR ||
			this.code === UNEXPECTED_ERROR_CODE.UNKNOWN_STORE_ERROR ||
			this.statusCode >= 500
		);
	}

	getValidationErrors(): ValidationErrorDetail[] {
		const errors = this.details?.responseBody;
		if (this.isValidationError() && Array.isArray(errors)) {
			if (
				errors.length > 0 &&
				errors[0] &&
				typeof errors[0] === "object" &&
				Object.hasOwn(errors[0], "property")
			) {
				return errors as ValidationErrorDetail[];
			}
		}
		return [];
	}

	getInvalidArgumentErrors(): unknown {
		const errors = this.details?.responseBody;
		if (this.isInvalidArgumentError()) {
			return Array.isArray(errors) ? errors : [errors];
		}
		return [];
	}

	getMessageKey(apiErrorResponse: ApiErrorResponse): string {
		if (this.isUnexpectedError()) {
			return "common.toast.error.unexpected.title";
		}
		return apiErrorResponse.message || "common.toast.error.default.title";
	}

	getDescriptionKey(apiErrorResponse: ApiErrorResponse): string {
		if (this.isUnexpectedError()) {
			return "common.toast.error.unexpected.description";
		}
		return (
			apiErrorResponse.description ||
			apiErrorResponse.message ||
			"common.toast.error.default.description"
		);
	}
}
