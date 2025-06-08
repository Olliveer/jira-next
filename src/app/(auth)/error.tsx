'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

function ErrorPage() {
  return (
    <div className="flex flex-col gap-y-2 items-center justify-center h-screen">
      <AlertTriangle className="size-6 text-muted-foreground" />
      <p className="text-sm font-semibold text-muted-foreground">Something went wrong</p>

      <Button variant="outline" size="sm" asChild>
        <Link href="/">Go back to home</Link>
      </Button>
    </div>
  );
}

export default ErrorPage;
