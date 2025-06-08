import { getWorkspaces } from '@/features/workspaces/queries';
import { redirect } from 'next/navigation';

export default async function Home() {
  const workspaces = await getWorkspaces();

  if (workspaces.total === 0) {
    return redirect('/workspaces/create');
  }

  return redirect(`/workspaces/${workspaces.documents[0].$id}`);
}
