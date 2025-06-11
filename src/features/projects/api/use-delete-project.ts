import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.projects)[':projectId']['$delete'], 200>;
type RequestType = InferRequestType<(typeof client.api.projects)[':projectId']['$delete']>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[':projectId']['$delete']({ param });

      if (!response.ok) {
        console.error(response);
        throw new Error('Failed to delete project');
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
      queryClient.invalidateQueries({
        queryKey: ['project', data.$id],
      });
      toast.success('Project deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete project');
    },
  });
};
