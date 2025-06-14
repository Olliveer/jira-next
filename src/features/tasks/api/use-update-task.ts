import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type ResponseType = InferResponseType<(typeof client.api.tasks)[':taskId']['$patch'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[':taskId']['$patch']>;

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.tasks[':taskId']['$patch']({ json, param });

      if (!response.ok) {
        console.info('[useUpdateTask]', response);
        throw new Error('Failed to update task');
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ['task', data.$id],
      });
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
      toast.success('Task updated successfully');
      router.refresh();
    },
    onError: () => {
      toast.error('Failed to update task');
    },
  });
};
