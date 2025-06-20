import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
import { WorkspaceClient } from './client';

async function WorkspaceIdPage() {
  const user = await getCurrent();

  if (!user) {
    return redirect('/sign-in');
  }

  return <WorkspaceClient />;
}

export default WorkspaceIdPage;
