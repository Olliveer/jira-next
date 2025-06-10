import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type ResponseType = InferResponseType<(typeof client.api.workspaces)[':workspaceId']['$patch'], 200>;
type RequestType = InferRequestType<(typeof client.api.workspaces)[':workspaceId']['$patch']>;

export const useUpdateWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[':workspaceId'].$patch({ form, param });

      if (!response.ok) {
        console.error(response);
        throw new Error('Failed to update workspace');
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
      toast.success('Workspace updated successfully');
      router.refresh();
    },
    onError: () => {
      toast.error('Failed to update workspace');
    },
  });
};
