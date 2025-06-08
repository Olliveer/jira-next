'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { CreateProjectForm } from './create-project-form';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';

export function CreateProjectModal() {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();

  return (
    <ResponsiveModal isOpen={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
}
