import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.members)[':memberId']['$delete'], 200>;
type RequestType = InferRequestType<(typeof client.api.members)[':memberId']['$delete']>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[':memberId'].$delete({ param });

      if (!response.ok) {
        console.error(response);
        throw new Error('Failed to delete member');
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
      toast.success('Member deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete member');
    },
  });
};
