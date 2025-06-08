import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

// type ResponseType = InferResponseType<(typeof client.api.projects)['$get']>;

export const useGetProjects = ({ workspaceId }: { workspaceId: string }) => {
  return useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: {
          workspaceId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const { data } = await response.json();

      return data;
    },
    throwOnError() {
      toast.error('Failed to fetch projects');

      return true;
    },
    retry: false,
  });
};
