'use client';

import { useCallback } from 'react';
import { PlusIcon, Loader2Icon } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCreateTaskModal } from '../hooks/use-create-task-modal';
import { useGetTasks } from '../api/use-get-tasks';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { DataFilters } from './data-filters';
import { useTaskFilters } from '../hooks/use-task-filters';
import { DataTable } from './data-table';
import { columns } from './columns';
import { DataKanban } from './data-kanban';
import { TaskStatus } from '../types';
import { useBulkUpdateTasks } from '../api/use-bulk-update-tasks';
import { DataCalendar } from './data-calendar';

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

export function TaskViewSwitcher({ hideProjectFilter }: TaskViewSwitcherProps) {
  const [{ projectId, status, assigneeId, search, dueDate }] = useTaskFilters();
  const [view, setView] = useQueryState('task-view', {
    defaultValue: 'table',
  });
  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId,
    status,
    assigneeId,
    search,
    dueDate,
  });

  const { mutate: updateTasks } = useBulkUpdateTasks();

  const handleKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      updateTasks({
        json: {
          tasks,
        },
      });
    },
    [updateTasks],
  );

  return (
    <Tabs defaultValue={view} onValueChange={setView} className="w-full flex-1 border rounded-lg">
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button size="sm" className="w-full lg:w-auto" onClick={() => open()}>
            <PlusIcon className="mr-2 size-4" />
            New
          </Button>
        </div>
        <Separator className="my-4" />
        <DataFilters hideProjectFilter={hideProjectFilter} />
        <Separator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader2Icon className="size-5 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban data={tasks?.documents ?? []} onChange={handleKanbanChange} />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}
