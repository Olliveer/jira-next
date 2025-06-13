import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.tasks)['$post'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)['$post']>;

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks.$post({ json });

      console.log(response);

      if (!response.ok) {
        console.error(response);
        throw new Error('Failed to create task');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
      toast.success('Task created successfully');
    },
    onError: () => {
      toast.error('Failed to create task');
    },
  });
};
