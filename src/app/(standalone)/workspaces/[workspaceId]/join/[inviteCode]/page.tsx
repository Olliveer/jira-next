import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
import { JoinWorkspacePageClient } from './client';

async function JoinWorkspacePage() {
  const user = await getCurrent();

  if (!user) {
    return redirect('/sign-in');
  }

  return <JoinWorkspacePageClient />;
}

export default JoinWorkspacePage;
