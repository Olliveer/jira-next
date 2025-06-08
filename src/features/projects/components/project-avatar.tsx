'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface WorkspaceAvatarProps {
  name: string;
  image: string;
  className?: string;
  fallbackClassName?: string;
}

export function ProjectAvatar({ name, image, className, fallbackClassName }: WorkspaceAvatarProps) {
  if (image) {
    return (
      <div className={cn('size-5 relative rounded-md overflow-hidden', className)}>
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn('size-5 rounded-md', fallbackClassName)}>
      <AvatarFallback
        className={cn('text-white bg-blue-600 rounded-md font-semibold text-sm uppercase', fallbackClassName)}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
