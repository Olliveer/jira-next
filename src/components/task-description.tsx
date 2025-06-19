import { useState } from 'react';
import { Task } from '@/features/tasks/types';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Loader2Icon, PencilIcon, XIcon } from 'lucide-react';
import { Separator } from './ui/separator';
import { useUpdateTask } from '@/features/tasks/api/use-update-task';

interface TaskDescriptionProps {
  task: Task;
}

export default function TaskDescription({ task }: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(task.description);

  const { mutate, isPending } = useUpdateTask();

  const handleUpdateTask = () => {
    mutate(
      {
        param: {
          taskId: task.$id,
        },
        json: {
          description,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button onClick={() => setIsEditing(prev => !prev)} variant="outline" size="sm">
          {isEditing ? (
            <>
              <XIcon className="mr-2 size-4" />
            </>
          ) : (
            <PencilIcon className="mr-2 size-4" />
          )}
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>
      <Separator className="my-4" />

      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add a description"
            rows={4}
            disabled={isPending}
          />
          <Button className="w-fit ml-auto" onClick={handleUpdateTask} disabled={isPending}>
            {isPending ? <Loader2Icon className="mr-2 size-4 animate-spin" /> : null}
            Save
          </Button>
        </div>
      ) : (
        <div>{task.description || <span className="text-muted-foreground">No description</span>}</div>
      )}
    </div>
  );
}
