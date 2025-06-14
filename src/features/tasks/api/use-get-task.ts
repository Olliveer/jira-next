import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { InferResponseType } from 'hono';

type ResponseType = InferResponseType<(typeof client.api.tasks)[':taskId']['$get'], 200>['data'];

interface UseGetTaskProps {
  taskId: string;
}

export const useGetTask = ({ taskId }: UseGetTaskProps) => {
  return useQuery<ResponseType, Error, ResponseType>({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await client.api.tasks[':taskId']['$get']({ param: { taskId } });

      if (!response.ok) {
        throw new Error('Failed to fetch task', { cause: response });
      }

      const { data } = await response.json();

      return data;
    },
    throwOnError() {
      toast.error('Failed to fetch task');

      return true;
    },
    retry: false,
  });
};
