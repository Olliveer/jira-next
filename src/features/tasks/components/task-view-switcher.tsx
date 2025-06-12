'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface TaskViewSwitcherProps {
  taskId: string;
}

export function TaskViewSwitcher({ taskId }: TaskViewSwitcherProps) {
  return (
    <Tabs defaultValue="table" className="w-full flex-1 border rounded-lg">
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
          <Button size="sm" className="w-full lg:w-auto">
            <PlusIcon className="mr-2 size-4" />
            New
          </Button>
        </div>
        <Separator className="my-4" />
        Data filters
        <Separator className="my-4" />
        <>
          <TabsContent value="table" className="mt-0">
            data table
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            kanban
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            calendar
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
}
