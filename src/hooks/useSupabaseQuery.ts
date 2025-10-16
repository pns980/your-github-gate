import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseSupabaseQueryOptions<T> {
  queryFn: () => Promise<{ data: T[] | null; error: any }>;
  onSuccess?: (data: T[]) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export function useSupabaseQuery<T>({
  queryFn,
  onSuccess,
  onError,
  enabled = true,
}: UseSupabaseQueryOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: result, error: queryError } = await queryFn();

      if (queryError) throw queryError;

      const resultData = (result || []) as T[];
      setData(resultData);
      onSuccess?.(resultData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
      
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [enabled]);

  return { data, loading, error, refetch: fetchData };
}
