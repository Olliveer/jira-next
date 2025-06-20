import { redirect } from 'next/navigation';
import { getCurrent } from '@/features/auth/queries';
import ProjectClient from './client';

export default async function ProjectPage() {
  const user = await getCurrent();

  if (!user) {
    return redirect('/sign-in');
  }

  return <ProjectClient />;
}
