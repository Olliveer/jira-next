import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { InferResponseType } from 'hono';

type ResponseType = InferResponseType<(typeof client.api.workspaces)[':workspaceId']['$get'], 200>['data'];

export const useGetWorkspace = ({ workspaceId }: { workspaceId: string }) => {
  return useQuery<ResponseType, Error, ResponseType>({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[':workspaceId']['$get']({
        param: {
          workspaceId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workspace', { cause: response });
      }

      const { data } = await response.json();

      return data;
    },
    throwOnError() {
      toast.error('Failed to fetch workspace');

      return true;
    },
    retry: false,
  });
};
