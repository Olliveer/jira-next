import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type ResponseType = InferResponseType<(typeof client.api.tasks)[':taskId']['$delete'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[':taskId']['$delete']>;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[':taskId']['$delete']({ param });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
      router.refresh();
      toast.success('Task deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete task');
    },
  });
};
