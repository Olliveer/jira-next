import { getWorkspaces } from '@/features/workspaces/queries';
import { redirect } from 'next/navigation';

export default async function Home() {
  const workspaces = await getWorkspaces();

  return redirect(`/workspaces/${workspaces.documents[0].$id}`);
}
