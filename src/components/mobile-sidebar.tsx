'use client';

import { MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from './ui/sheet';
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
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
