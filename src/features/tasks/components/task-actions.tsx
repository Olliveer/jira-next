import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useDeleteTask } from '../api/use-delete-task';
import { useConfirm } from '@/hooks/use-confirm';
import { useRouter } from 'next/navigation';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';

interface TaskActionsProps {
  taskId: string;
  projectId: string;
  children: React.ReactNode;
}

export function TaskActions({ taskId, projectId, children }: TaskActionsProps) {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useDeleteTask();

  const { open } = useEditTaskModal();

  const [ConfirmDeleteTaskDialog, confirmDeleteTask] = useConfirm({
    title: 'Delete task',
    message: 'Are you sure you want to delete this task?',
    variant: 'destructive',
  });

  const handleDeleteTask = async () => {
    const ok = await confirmDeleteTask();

    if (!ok) {
      return;
    }

    mutate({ param: { taskId } });
  };

  const handleOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  const handleOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
  };

  return (
    <div className="flex justify-end">
      <ConfirmDeleteTaskDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleOpenTask} disabled={false} className="font-medium p-[10px]">
            <ExternalLinkIcon className="mr-2 size-4 stroke-2" />
            Task details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenProject} disabled={false} className="font-medium p-[10px]">
            <ExternalLinkIcon className="mr-2 size-4 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => open(taskId)} disabled={false} className="font-medium p-[10px]">
            <PencilIcon className="mr-2 size-4 stroke-2" />
            Edit task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteTask}
            disabled={isPending}
            className="font-medium p-[10px] text-red-500 focus:text-red-500"
          >
            <TrashIcon className="text-red-500 mr-2 size-4 stroke-2" />
            Delete task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
