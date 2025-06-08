import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

// type ResponseType = InferResponseType<(typeof client.api.members)['$get']>;

export const useGetMembers = ({ workspaceId }: { workspaceId: string }) => {
  return useQuery({
    queryKey: ['members', workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({ query: { workspaceId } });

      if (!response.ok) {
        console.error(response);
        throw new Error('Failed to fetch members');
      }

      const { data } = await response.json();

      return data;
    },
    throwOnError() {
      toast.error('Failed to fetch members');

      return true;
    },
    retry: false,
  });
};
