import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';

async function WorkspaceIdPage({ params }: { params: { workspaceId: string } }) {
  const user = await getCurrent();

  if (!user) {
    return redirect('/sign-in');
  }

  return <div>WorkspaceIdPage {params.workspaceId}</div>;
}

export default WorkspaceIdPage;
