import { getCurrent } from '@/features/auth/queries';
import { getProject } from '@/features/projects/queries';
import { redirect } from 'next/navigation';
import { EditProjectForm } from '@/features/projects/components/edit-project-form';

async function ProjectSettingsPage({
  params,
}: {
  params: {
    projectId: string;
  };
}) {
  const { projectId } = await params;
  const user = getCurrent();

  if (!user) {
    return redirect('/sign-in');
  }

  const initialValues = await getProject({
    projectId,
  });

  if (!initialValues) {
    throw new Error('Project not found');
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
}

export default ProjectSettingsPage;
