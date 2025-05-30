'use client';

import { useCurrent } from '@/features/auth/api/use-current';
import { useLogout } from '@/features/auth/api/use-logout';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { data, isPending } = useCurrent();

  const { mutate } = useLogout();

  useEffect(() => {
    if (!data && !isPending) {
      router.push('/sign-in');
    }
  }, [data, isPending, router]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    mutate();
    router.push('/sign-in');
  };

  return (
    <div>
      hello {data?.name}
      <button onClick={handleLogout} disabled={isPending}>
        {isPending ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}
