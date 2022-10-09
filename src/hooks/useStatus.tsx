import { useState, useCallback } from "react";

export function useStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const setErrorLoading = useCallback((error: Error) => {
    setLoading(false);
    setError(error);
  }, []);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setErrorLoading,
  };
}
