import { useCallback, useRef, useState } from "react";

type UseAsyncLoadOptions<TResult> = {
  initialData?: TResult | null;
  initialLoading?: boolean;
  onSuccess?: (data: TResult) => void;
  onError?: (error: unknown) => void;
};

export function useAsyncLoad<TResult, TArgs extends unknown[] = []>(
  loader: (...args: TArgs) => Promise<TResult>,
  {
    initialData = null,
    initialLoading = false,
    onSuccess,
    onError,
  }: UseAsyncLoadOptions<TResult> = {},
) {
  const [data, setData] = useState<TResult | null>(initialData);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<unknown>(null);

  const requestIdRef = useRef(0);

  const run = useCallback(
    async (...args: TArgs) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);

      try {
        const result = await loader(...args);
        if (requestId !== requestIdRef.current) return result;
        setData(result);
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
    [loader, onError, onSuccess],
  );

  const reset = useCallback(() => {
    requestIdRef.current++;
    setLoading(false);
    setError(null);
    setData(initialData);
  }, [initialData]);

  return {
    data,
    setData,
    loading,
    error,
    run,
    reset,
  };
}
