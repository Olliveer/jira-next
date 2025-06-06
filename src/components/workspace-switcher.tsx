'use client';

import { useRouter } from 'next/navigation';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { RiAddCircleFill } from 'react-icons/ri';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { WorkspaceAvatar } from '@/features/workspaces/components/workspace-avatar';
import { LoaderCircleIcon } from 'lucide-react';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal';

export function WorkspaceSwitcher() {
  const { open } = useCreateWorkspaceModal();
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaces();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase text-neutral-500">Workspaces</p>
          <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
        </div>
        <div className="flex items-center justify-center">
          <LoaderCircleIcon className="size-4 animate-spin" />
        </div>
      </div>
    );
  }

  const handleWorkspaceChange = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      <Select onValueChange={handleWorkspaceChange} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1 h-12!">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {data?.documents.map(workspace => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex justify-center items-center gap-3 font-medium ">
                <WorkspaceAvatar name={workspace.name} image={workspace.imageUrl} />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
