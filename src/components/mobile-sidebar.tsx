'use client';

import { MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { Sidebar } from './sidebar';

export function MobileSidebar() {
  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="lg:hidden" size="icon">
          <MenuIcon className="size-4 text-neutral-500" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>sidebar</SheetDescription>
        </SheetHeader>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
