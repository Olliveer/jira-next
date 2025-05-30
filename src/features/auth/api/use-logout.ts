import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferResponseType } from 'hono';

type ResponseType = InferResponseType<(typeof client.api.auth.logout)['$post']>;

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post();
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['current'],
      });
    },
  });
};
