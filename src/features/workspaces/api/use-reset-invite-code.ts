import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[':workspaceId']['reset-invite-code']['$post'],
  200
>;
type RequestType = InferRequestType<(typeof client.api.workspaces)[':workspaceId']['reset-invite-code']['$post']>;

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[':workspaceId']['reset-invite-code']['$post']({ param });

      if (!response.ok) {
        console.info('[useResetInviteCode]', response);
        throw new Error('Failed to reset invite code');
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ['workspaces'],
      });
      queryClient.invalidateQueries({
        queryKey: ['workspace', data.$id],
      });
      toast.success('Invite code reset successfully');
    },
    onError: () => {
      toast.error('Failed to reset invite code');
    },
  });
};
