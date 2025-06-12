import { redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getCurrent } from '@/features/auth/queries';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { getProject } from '@/features/projects/queries';
import { PencilIcon } from 'lucide-react';
import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher';

export default async function ProjectPage({ params }: { params: { projectId: string } }) {
  const user = await getCurrent();

  if (!user) {
    return redirect('/sign-in');
  }

  const { projectId } = await params;

  const initialValues = await getProject({ projectId });

  if (!initialValues) {
    throw new Error('Project not found');
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar name={initialValues.name} image={initialValues.imageUrl} className="size-8" />
          <p className="text-lg font-semibold">{initialValues.name}</p>
        </div>

        <div className="">
          <Button variant="outline" asChild>
            <Link href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}>
              <PencilIcon className="mr-2 size-4" /> Edit Project
            </Link>
          </Button>
        </div>
      </div>

      <TaskViewSwitcher taskId={initialValues.$id} />
    </div>
  );
}
