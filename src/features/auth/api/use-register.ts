import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';

type ResponseType = InferResponseType<(typeof client.api.auth.register)['$post']>;
type RequestType = InferRequestType<(typeof client.api.auth.register)['$post']>;

/**
 * Registers a new user.
 *
 * @example
 * const { mutate, isLoading } = useRegister();
 * mutate({ email: 'foo@bar.com', password: 'mysecretpassword' });
 *
 * @param {Object} request - The request object.
 * @param {string} request.email - The user's email.
 * @param {string} request.password - The user's password.
 * @returns {Promise<ResponseType>} The response object.
 */
export const useRegister = (): UseMutationResult<ResponseType, Error, RequestType> => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['current'],
      });
      router.refresh();
    },
  });
};
