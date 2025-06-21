'use client';

import { RiAddCircleFill } from 'react-icons/ri';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { LoaderCircleIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';

export function Projects() {
  const { open } = useCreateProjectModal();
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useGetProjects({ workspaceId });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase text-neutral-500">Projects</p>
          <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
        </div>
        <div className="flex items-center justify-center">
          <LoaderCircleIcon className="size-4 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500 ">Projects</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {data?.documents.map(project => {
        const isActive = pathname === `/workspaces/${workspaceId}/projects/${project.$id}`;

        return (
          <Link key={project.$id} href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
            <div
              className={cn(
                'flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:opacity-75 transition cursor-pointer text-neutral-500',
                isActive &&
                  'bg-white shadow-sm hover:opacity-100 text-primary dark:bg-neutral-800 dark:text-neutral-100',
              )}
            >
              <ProjectAvatar name={project.name} image={project.imageUrl} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
