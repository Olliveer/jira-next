import { getCurrent } from '@/features/auth/actions';
import { redirect } from 'next/navigation';

async function WorkspaceIdPage() {
  const user = await getCurrent();

  if (!user) {
    return redirect('/sign-in');
  }

  return <div>WorkspaceIdPage</div>;
}

export default WorkspaceIdPage;
