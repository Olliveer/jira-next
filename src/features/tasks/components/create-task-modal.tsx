'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { CreateTaskFormWrapper } from './create-task-form-wrapper';
// import { ScrollArea } from '@/components/ui/scroll-area';

export function CreateTaskModal() {
  const { isOpen, setIsOpen, close } = useCreateTaskModal();

  return (
    <ResponsiveModal isOpen={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskFormWrapper onCancel={close} />
      {/* <ScrollArea className="h-[714px] w-full rounded-md border">
      </ScrollArea> */}
    </ResponsiveModal>
  );
}
