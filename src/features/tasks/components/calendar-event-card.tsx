import { Project } from '@/features/projects/types';
import { TaskStatus } from '../types';
import { cn } from '@/lib/utils';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CalendarEventCardProps {
  id: string;
  title: string;
  project: Project;
  assignee: string;
  status: TaskStatus;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: 'border-l-gray-500',
  [TaskStatus.TODO]: 'border-l-red-500',
  [TaskStatus.IN_PROGRESS]: 'border-l-yellow-500',
  [TaskStatus.IN_REVIEW]: 'border-l-green-500',
  [TaskStatus.DONE]: 'border-l-blue-500',
};

export function CalendarEventCard({ id, title, project, assignee, status }: CalendarEventCardProps) {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/projects/${project.$id}/tasks/${id}`);
  };

  return (
    <div className="px-2">
      <div
        className={cn(
          'p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition',
          statusColorMap[status],
        )}
        onClick={onClick}
      >
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <Tooltip>
            <TooltipTrigger>
              <MemberAvatar name={assignee} className="size-6" fallbackClassName="text-xs" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{assignee}</p>
            </TooltipContent>
          </Tooltip>
          <div className="size-1 rounded-full bg-neutral-300"></div>
          <Tooltip>
            <TooltipTrigger>
              <ProjectAvatar
                name={project.name}
                image={project.imageUrl}
                className="size-6"
                fallbackClassName="text-xs size-6"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{project.name}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
