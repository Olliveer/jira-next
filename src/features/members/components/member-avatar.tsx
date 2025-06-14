import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MemberAvatarProps {
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export function MemberAvatar({ name, className, fallbackClassName }: MemberAvatarProps) {
  return (
    <Avatar className={cn('size-10 transition border border-neutral-300 rounded-full', className)}>
      <AvatarFallback
        className={cn(
          'bg-neutral-300 font-medium text-neutral-500 flex items-center justify-center',
          fallbackClassName,
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
