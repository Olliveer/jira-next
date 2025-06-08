import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.members)[':memberId']['$patch'], 200>;
type RequestType = InferRequestType<(typeof client.api.members)[':memberId']['$patch']>;

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.members[':memberId'].$patch({ param, json });

      if (!response.ok) {
        console.error(response);
        throw new Error('Failed to update member');
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ['members'],
      });
      queryClient.invalidateQueries({
        queryKey: ['member', data.$id],
      });
      toast.success('Member updated successfully');
    },
    onError: () => {
      toast.error('Failed to update member');
    },
  });
};
