'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Task } from '../types';
import { ArrowUpDown, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { TaskDate } from './task-date';
import { TaskType } from './task-type';
import { TaskActions } from './task-actions';

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;
      return <p className="line-clamp-1">{name}</p>;
    },
  },
  {
    accessorKey: 'project',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { project } = row.original;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <ProjectAvatar className="size-6" name={project.name} image={project.imageUrl} />
          <p className="line-clamp-1">{project.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'assignee',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { assignee } = row.original;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <MemberAvatar fallbackClassName="size-6" className="text-xs size-6" name={assignee.name} />
          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { dueDate } = row.original;
      return <TaskDate value={dueDate} />;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { status } = row.original;

      return <TaskType type={status} />;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { $id, projectId } = row.original;
      return (
        <TaskActions taskId={$id} projectId={projectId}>
          <Button variant="ghost" size="icon" className="size-4 p-0">
            <MoreVertical className="size-4" />
          </Button>
        </TaskActions>
      );
    },
  },
];
