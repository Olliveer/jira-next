import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCurrent = () =>
  useQuery({
    queryKey: ['current'],
    queryFn: async () => {
      const response = await client.api.auth.current.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch current user');
      }

      const { data } = await response.json();

      return data;
    },
    throwOnError() {
      toast.error('Failed to fetch current user');
      return true;
    },
    retry: false,
  });
