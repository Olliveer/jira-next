'use client';

import { UserButton } from '@/features/auth/components/user-button';
import { MobileSidebar } from './mobile-sidebar';
import { usePathname } from 'next/navigation';
import { ModeToggle } from './mode-toggle';

const pathNameMap = {
  tasks: {
    title: 'Tasks',
    description: 'Monitor all of your tasks here',
  },
  projects: {
    title: 'My Project',
    description: 'Monitor all of your projects here',
  },
  members: {
    title: 'Members',
    description: 'Monitor all of your members here',
  },
};

const defaultMap = {
  title: 'Home',
  description: 'Monitor all of your projects and tasks here',
};

export function Navbar() {
  const pathname = usePathname();
  const pathNameParts = pathname.split('/');
  const pathNameKey = pathNameParts[3] as keyof typeof pathNameMap;

  const { title, description } = pathNameMap[pathNameKey] || defaultMap;

  return (
    <nav className="pt-4 px-6  flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold ">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <div className="flex items-center gap-2">
        <ModeToggle />
        <UserButton />
      </div>
    </nav>
  );
}
