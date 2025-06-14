import { getCurrent } from '@/features/auth/queries';
import { getWorkspace } from '@/features/workspaces/queries';
import { EditWorkspaceForm } from '@/features/workspaces/components/edit-workspace-form';
import { redirect } from 'next/navigation';

interface WorkspaceSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

async function WorkspaceSettingsPage({ params }: WorkspaceSettingsPageProps) {
  const user = await getCurrent();
  const { workspaceId } = await params;

  if (!user) {
    return redirect('/sign-in');
  }

  const initialValues = await getWorkspace({ workspaceId });

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
}

export default WorkspaceSettingsPage;
