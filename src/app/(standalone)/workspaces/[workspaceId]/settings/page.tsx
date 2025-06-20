import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
import WorkspaceSettingsClient from './client';

async function WorkspaceSettingsPage() {
  const user = await getCurrent();

  if (!user) {
    return redirect('/sign-in');
  }

  return <WorkspaceSettingsClient />;
}

export default WorkspaceSettingsPage;
