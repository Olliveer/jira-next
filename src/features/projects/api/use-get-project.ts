import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { InferResponseType } from 'hono';

type ResponseType = InferResponseType<(typeof client.api.projects)[':projectId']['$get'], 200>['data'];

interface UseGetProjectProps {
  projectId: string;
}

export const useGetProject = ({ projectId }: UseGetProjectProps) => {
  return useQuery<ResponseType, Error, ResponseType>({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await client.api.projects[':projectId']['$get']({ param: { projectId } });

      if (!response.ok) {
        throw new Error('Failed to fetch project', { cause: response });
      }

      const { data } = await response.json();

      return data;
    },
    throwOnError() {
      toast.error('Failed to fetch project');

      return true;
    },
    retry: false,
  });
};
