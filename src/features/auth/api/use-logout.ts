import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.auth.logout)['$post']>;

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post();

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['current'],
      });
      router.refresh();
      toast.success('Logout successful');
    },
    onError: () => {
      toast.error('Failed to logout');
    },
  });
};
