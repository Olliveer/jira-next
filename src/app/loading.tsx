'use client';

import { Spinner } from '@/components/ui/spinner';

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-white/80">
      <Spinner size="large">Loading...</Spinner>
    </div>
  );
}
