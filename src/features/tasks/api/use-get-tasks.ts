import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

// type ResponseType = InferResponseType<(typeof client.api.projects)['$get']>;

interface UseGetTasksProps {
  workspaceId: string;
}

export const useGetTasks = ({ workspaceId }: UseGetTasksProps) => {
  return useQuery({
    queryKey: ['tasks', workspaceId],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const { data } = await response.json();

      return data;
    },
    throwOnError() {
      toast.error('Failed to fetch tasks');

      return true;
    },
    retry: false,
  });
};
