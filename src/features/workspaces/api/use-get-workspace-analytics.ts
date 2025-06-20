import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { InferResponseType } from 'hono';

export type WorkspaceAnalytics = InferResponseType<
  (typeof client.api.workspaces)[':workspaceId']['analytics']['$get'],
  200
>['data'];

interface UseGetWorkspaceAnalyticsProps {
  workspaceId: string;
}

export const useGetWorkspaceAnalytics = ({ workspaceId }: UseGetWorkspaceAnalyticsProps) => {
  return useQuery<WorkspaceAnalytics, Error, WorkspaceAnalytics>({
    queryKey: ['workspace-analytics', workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[':workspaceId']['analytics'].$get({ param: { workspaceId } });

      if (!response.ok) {
        throw new Error('Failed to fetch workspace analytics', { cause: response });
      }
      const { data } = await response.json();
      return data;
    },
    throwOnError() {
      toast.error('Failed to fetch workspace analytics');

      return true;
    },
    retry: false,
  });
};
