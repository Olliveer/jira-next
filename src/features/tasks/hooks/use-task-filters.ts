'use client';

import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';
import { TaskStatus } from '../types';

export function useTaskFilters() {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
}
