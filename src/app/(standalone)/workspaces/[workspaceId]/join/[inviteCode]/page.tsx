import { getCurrent } from '@/features/auth/queries';
import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form';
import { getWorkspaceInfo } from '@/features/workspaces/queries';
import { redirect } from 'next/navigation';

async function JoinWorkspacePage({ params }: { params: { workspaceId: string; inviteCode: string } }) {
  const user = await getCurrent();

  if (!user) {
    return redirect('/sign-in');
  }

  const { workspaceId } = await params;

  const workspaceInfo = await getWorkspaceInfo({ workspaceId });

  if (!workspaceInfo) {
    return redirect('/');
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={workspaceInfo} />
    </div>
  );
}

export default JoinWorkspacePage;
