import { useRef, useEffect, useCallback } from 'react';

// biome-ignore lint/suspicious/noExplicitAny: the function can receive various type of parameter
export default function useDebounceFn<T extends (...args: any[]) => void>(
  fn: T,
  delay = 300
): T {
  const timer = useRef<NodeJS.Timeout>(undefined);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  return debouncedFn as T;
}
