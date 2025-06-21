'use client';

import { LoaderCircleIcon, LogOut } from 'lucide-react';
import { useCurrent } from '../api/use-current';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/features/auth/api/use-logout';

export function UserButton() {
  const { data, isLoading } = useCurrent();
  const { mutate } = useLogout();

  if (isLoading)
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-500 border border-neutral-300">
        <LoaderCircleIcon className="size-4 animate-spin " />
      </div>
    );

  const avatarFallback = data?.name ? data.name.charAt(0).toUpperCase() : data?.email.charAt(0).toUpperCase() ?? 'U';

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-8 hover:opacity-75 transition border border-neutral-300">
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500">{avatarFallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-56" sideOffset={10}>
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] border border-neutral-300">
            <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900">{data?.name}</p>
            <p className="text-xs text-neutral-500">{data?.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator className="mb-1" />
        <DropdownMenuItem
          onClick={() => mutate()}
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
