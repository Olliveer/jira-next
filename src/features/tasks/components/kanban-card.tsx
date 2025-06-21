import { MoreHorizontal } from 'lucide-react';
import { Task } from '../types';
import { TaskActions } from './task-actions';
import { Separator } from '@/components/ui/separator';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { TaskDate } from './task-date';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';

interface KanbanCardProps {
  task: Task;
}

export function KanbanCard({ task }: KanbanCardProps) {
  return (
    <div className="bg-white border dark:bg-neutral-800 p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-x-2">
        <p className="line-clamp-2 text-sm">{task.name}</p>
        <TaskActions taskId={task.$id} projectId={task.projectId}>
          <MoreHorizontal className="siz-[18px] stroke-1 shrink-0 text-neutral-700 dark:text-neutral-100 hover:opacity-75 transition" />
        </TaskActions>
      </div>
      <Separator />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          name={task.assignee.name}
          fallbackClassName="text-[10px]"
          className="size-6 dark:text-neutral-100"
        />
        <div className="size-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
      <div className="flex items-center gap-x-1.5 ">
        <ProjectAvatar
          name={task.project.name}
          image={task.project.imageUrl}
          fallbackClassName="text-[10px] size-6 dark:text-neutral-100"
        />
        <span className="text-xs font-medium dark:text-neutral-100">{task.project.name}</span>
      </div>
    </div>
  );
}
