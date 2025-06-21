'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isSignUpPage = pathname === '/sign-up';

  return (
    <main className="bg-neutral-100 dark:bg-neutral-900 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <Image src={'/logo.svg'} alt="Logo" width={120} height={120} />
          <Button variant="secondary" asChild>
            <Link href={isSignUpPage ? '/sign-in' : '/sign-up'}>{isSignUpPage ? 'Login' : 'Sign Up'}</Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center h-full">{children}</div>
      </div>
    </main>
  );
}

export default AuthLayout;
