import { getCurrent } from '@/features/auth/actions';
import { CreateWorkspaceForm } from '@/features/workspaces/components/create-workspace-form';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getCurrent();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div>
      <CreateWorkspaceForm />
    </div>
  );
}
