import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { InferResponseType } from 'hono';
import { TaskStatus } from '../types';

type ResponseType = InferResponseType<(typeof client.api.tasks)['$get'], 200>['data'];

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
  search?: string | null;
  dueDate?: string | null;
}

export const useGetTasks = ({ workspaceId, projectId, status, assigneeId, search, dueDate }: UseGetTasksProps) => {
  return useQuery<ResponseType, Error, ResponseType>({
    queryKey: ['tasks', workspaceId, projectId, status, assigneeId, search, dueDate],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          assigneeId: assigneeId ?? undefined,
          search: search ?? undefined,
          dueDate: dueDate ?? undefined,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks', { cause: response });
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
