import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.workspaces)[':workspaceId']['$delete'], 200>;
type RequestType = InferRequestType<(typeof client.api.workspaces)[':workspaceId']['$delete']>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[':workspaceId'].$delete({ param });

      if (!response.ok) {
        console.error(response);
        throw new Error('Failed to delete workspace');
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
      toast.success('Workspace deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete workspace');
    },
  });
};
