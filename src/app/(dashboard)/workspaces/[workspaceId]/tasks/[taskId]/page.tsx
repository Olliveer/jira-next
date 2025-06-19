import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
import TaskPageDetailsClient from './client';

async function TaskPageDetails() {
  const user = await getCurrent();

  if (!user) {
    return redirect('/sign-in');
  }

  return <TaskPageDetailsClient />;
}

export default TaskPageDetails;
