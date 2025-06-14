'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface WorkspaceAvatarProps {
  name: string;
  image: string;
  className?: string;
}

export function WorkspaceAvatar({ name, image, className }: WorkspaceAvatarProps) {
  if (image) {
    return (
      <div className={cn('size-10 relative rounded-md overflow-hidden', className)}>
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn('size-10 rounded-md', className)}>
      <AvatarFallback className="text-white bg-blue-600 rounded-md font-semibold text-lg uppercase ">
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
