import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.tasks)['bulk-update']['$post'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)['bulk-update']['$post']>;

export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks['bulk-update']['$post']({ json });

      if (!response.ok) {
        console.info('[useBulkUpdateTasks]', response);
        throw new Error('Failed to update tasks');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
      queryClient.invalidateQueries({
        queryKey: ['project-analytics'],
      });
      queryClient.invalidateQueries({
        queryKey: ['workspace-analytics'],
      });
      toast.success('Tasks updated successfully');
    },
    onError: () => {
      toast.error('Failed to update task');
    },
  });
};
