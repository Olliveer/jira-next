import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.auth.login)['$post']>;
type RequestType = InferRequestType<(typeof client.api.auth.login)['$post']>;

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login.$post({ json });

      if (!response.ok) {
        console.info('[useLogin]', response);
        throw new Error('Failed to login');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['current'],
      });
      router.refresh();
      toast.success('Login successful');
    },
    onError: error => {
      console.info('[useLogin]', error);
      toast.error('Failed to login');
    },
  });
};
