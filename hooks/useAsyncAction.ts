import { useCallback, useRef, useState } from "react";

type UseAsyncActionOptions<TResult> = {
  initialLoading?: boolean;
  onSuccess?: (result: TResult) => void;
  onError?: (error: unknown) => void;
};

export function useAsyncAction<TResult, TArgs extends unknown[] = []>(
  action: (...args: TArgs) => Promise<TResult>,
  {
    initialLoading = false,
    onSuccess,
    onError,
  }: UseAsyncActionOptions<TResult> = {},
) {
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<unknown>(null);

  const requestIdRef = useRef(0);

  const run = useCallback(
    async (...args: TArgs) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);

      try {
        const result = await action(...args);
        if (requestId !== requestIdRef.current) return result;
        onSuccess?.(result);
        return result;
      } catch (err) {
        if (requestId !== requestIdRef.current) throw err;
        setError(err);
        onError?.(err);
        throw err;
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    [action, onError, onSuccess],
  );

  const reset = useCallback(() => {
    requestIdRef.current++;
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    run,
    reset,
  };
}
