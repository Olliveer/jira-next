'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { useEditTaskModal } from '@/features/tasks/hooks/use-edit-task-modal';
import { EditTaskFormWrapper } from './edit-task-form-wrapper';
// import { ScrollArea } from '@/components/ui/scroll-area';

export function EditTaskModal() {
  const { taskId, close } = useEditTaskModal();

  return (
    <ResponsiveModal isOpen={!!taskId} onOpenChange={close}>
      {taskId ? <EditTaskFormWrapper onCancel={close} taskId={taskId} /> : null}
    </ResponsiveModal>
  );
}
