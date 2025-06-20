import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
import ProjectSettingsClient from './client';

async function ProjectSettingsPage() {
  const user = getCurrent();

  if (!user) {
    return redirect('/sign-in');
  }

  return <ProjectSettingsClient />;
}

export default ProjectSettingsPage;
