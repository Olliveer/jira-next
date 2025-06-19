import Link from 'next/link';
import { Task } from '../types';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { ChevronRightIcon, LoaderIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeleteTask } from '../api/use-delete-task';
import { useConfirm } from '@/hooks/use-confirm';
import { useRouter } from 'next/navigation';

interface TaskBreadcrumbsProps {
  projectId: string;
  task: Task;
}

export function TaskBreadcrumbs({ projectId, task }: TaskBreadcrumbsProps) {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const [ConfirmDeleteTaskDialog, confirm] = useConfirm({
    title: 'Delete task',
    message: 'Are you sure you want to delete this task?',
    variant: 'destructive',
  });

  const { mutate: deleteTask, isPending } = useDeleteTask();

  const handleDeleteTask = async () => {
    const ok = await confirm();

    if (!ok) {
      return;
    }

    deleteTask(
      {
        param: {
          taskId: task.$id,
        },
      },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDeleteTaskDialog />
      <ProjectAvatar name={task.project.name} image={task.project.imageUrl} fallbackClassName=" size-6 lg:size-8" />
      <Link href={`/workspaces/${workspaceId}/projects/${projectId}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transaition">
          {task.project.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button className="ml-auto" variant="destructive" size="sm" onClick={handleDeleteTask} disabled={isPending}>
        {isPending ? <LoaderIcon className="size-4 lg:mr-2 animate-spin" /> : <TrashIcon className="size-4 lg:mr-2" />}
        <span className="hidden lg:block">Delete task</span>
      </Button>
    </div>
  );
}
