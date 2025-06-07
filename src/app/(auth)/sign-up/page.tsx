import { SignUpCard } from '@/features/auth/components/sign-up-card.';
import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';

async function SignUpPage() {
  const user = await getCurrent();

  if (user) {
    return redirect('/');
  }

  return <SignUpCard />;
}

export default SignUpPage;
