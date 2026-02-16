import { useCallback, useEffect, useRef, useState } from "react";

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

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

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
        onSuccessRef.current?.(result);
        return result;
      } catch (err) {
        if (requestId !== requestIdRef.current) throw err;
        setError(err);
        onErrorRef.current?.(err);
        throw err;
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    [loader],
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
