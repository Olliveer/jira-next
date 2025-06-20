import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { InferResponseType } from 'hono';

export type ProjectAnalytics = InferResponseType<
  (typeof client.api.projects)[':projectId']['analytics']['$get'],
  200
>['data'];

interface UseGetProjectAnalyticsProps {
  projectId: string;
}

export const useGetProjectAnalytics = ({ projectId }: UseGetProjectAnalyticsProps) => {
  return useQuery<ProjectAnalytics, Error, ProjectAnalytics>({
    queryKey: ['project-analytics', projectId],
    queryFn: async () => {
      const response = await client.api.projects[':projectId']['analytics'].$get({ param: { projectId } });

      if (!response.ok) {
        throw new Error('Failed to fetch project analytics', { cause: response });
      }
      const { data } = await response.json();
      return data;
    },
    throwOnError() {
      toast.error('Failed to fetch project analytics');

      return true;
    },
    retry: false,
  });
};
