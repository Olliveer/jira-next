import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';

async function WorkspaceIdPage({ params }: { params: { workspaceId: string } }) {
  const user = await getCurrent();
  const { workspaceId } = await params;

  if (!user) {
    return redirect('/sign-in');
  }

  return <div>WorkspaceIdPage {workspaceId}</div>;
}

export default WorkspaceIdPage;
