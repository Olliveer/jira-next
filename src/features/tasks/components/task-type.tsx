import { TaskStatus } from '../types';
import { Badge } from '@/components/ui/badge';
import { snakeCaseToTitleCase } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';

interface TaskTypeProps {
  type: TaskStatus;
}

export function TaskType({ type }: TaskTypeProps) {
  let variant = 'default';

  if (type === TaskStatus.TODO) {
    variant = 'default';
  } else if (type === TaskStatus.IN_PROGRESS) {
    variant = 'secondary';
  } else if (type === TaskStatus.DONE) {
    variant = 'success';
  } else if (type === TaskStatus.IN_REVIEW) {
    variant = 'warning';
  } else if (type === TaskStatus.BACKLOG) {
    variant = 'info';
  } else {
    variant = 'default';
  }

  return (
    <Badge variant={variant as VariantProps<typeof Badge>['variant']} size="sm">
      {snakeCaseToTitleCase(type)}
    </Badge>
  );
}
