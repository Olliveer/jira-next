import { UserButton } from '@/features/auth/components/user-button';
import Image from 'next/image';
import Link from 'next/link';

export default function StandaloneLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={152} height={56} />
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col justify-center items-center py-4">{children}</div>
      </div>
    </main>
  );
}
