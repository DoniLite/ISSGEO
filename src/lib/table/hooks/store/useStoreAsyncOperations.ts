import { ApiError, UNEXPECTED_ERROR_CODE } from '@/lib/interfaces/errors';
import type { PaginationQuery } from '@/lib/interfaces/pagination';
import { useState } from 'react';

/**
 * Composable for handling async operations in stores
 * Provides consistent loading states, error handling, and operation execution
 */
export function useStoreAsyncOperations() {
  // Reactive state - these refs maintain reactivity when exposed through stores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  /**
   * Handle API errors consistently across all stores
   */
  function handleApiError(err: unknown, throwError = true) {
    if (err instanceof ApiError) {
      if (err.code === UNEXPECTED_ERROR_CODE.SESSION_EXPIRED_HANDLED) {
        setError(null);
      } else {
        setError(err);
      }
    } else {
      setError(
        new ApiError({
          statusCode: 500,
          code: UNEXPECTED_ERROR_CODE.UNKNOWN_STORE_ERROR,
          message:
            err instanceof Error
              ? err.message
              : 'An unknown error occurred processing the request.',
        })
      );
    }

    if (throwError) {
      throw error;
    }
  }

  /**
   * Prepare for async operation - reset error and set loading
   */
  function prepare() {
    setLoading(true);
    setError(null);
  }

  /**
   * Reset all state
   */
  function resetState() {
    setLoading(false);
    setError(null);
  }

  /**
   * Execute an async operation with consistent error handling and loading state management
   */
  async function executeOperation<T>(
    operation: () => Promise<T>,
    options: { throwOnError?: boolean } = {}
  ): Promise<T | undefined> {
    const { throwOnError = true } = options;
    prepare();
    try {
      const result = await operation();
      return result;
    } catch (err) {
      handleApiError(err, throwOnError);
      return undefined;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Decorator function for cleaner store action syntax
   * Wraps an operation with consistent loading state and error handling
   */
  const withAsyncOperation = <TArgs extends unknown[], TReturn>(
    operation: (...args: TArgs) => Promise<TReturn>,
    options: { throwOnError?: boolean } = {}
  ) => {
    return (...args: TArgs) =>
      executeOperation(() => operation(...args), options);
  };

  const fetchAllQuery = (
    newQuery: PaginationQuery & Record<string, unknown>
  ) => {
    const simpleQuery = { ...newQuery.filters, ...newQuery, pageSize: -1 };
    delete simpleQuery.filters; // Remove the filters property
    return simpleQuery;
  };

  return {
    loading: loading,

    executeOperation,
    withAsyncOperation,
    resetState,

    fetchAllQuery,
    prepare,
    handleApiError,
  };
}
