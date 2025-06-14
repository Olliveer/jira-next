'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2Icon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { updateTaskSchema } from '../schemas';
import { useUpdateTask } from '../api/use-update-task';
import { DatePicker } from '@/components/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { TaskStatus } from '../types';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { Textarea } from '@/components/ui/textarea';
import { Task } from '../types';

interface EditTaskFormProps {
  onCancel?: () => void;
  projectOptions?: { id: string; name: string; imageUrl: string }[];
  memberOptions?: { id: string; name: string }[];
  initialValues: Task;
}

export function EditTaskForm({ onCancel, projectOptions, memberOptions, initialValues }: EditTaskFormProps) {
  const { mutate, isPending } = useUpdateTask();

  const form = useForm<z.infer<typeof updateTaskSchema>>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      ...initialValues,
      dueDate: initialValues.dueDate ? new Date(initialValues.dueDate) : undefined,
    },
  });

  function onSubmit(values: z.infer<typeof updateTaskSchema>) {
    mutate(
      {
        json: values,
        param: {
          taskId: initialValues.$id,
        },
      },
      {
        onSuccess: () => {
          // form.reset();
          // TODO: GO TO THE NEW TASK
          onCancel?.();
          // router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
        },
      },
    );
  }

  return (
    <Card className="w-full h-full border-none shadow-none gap-2">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit Task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <FormControl>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {memberOptions?.map(member => (
                          <SelectItem key={member.id} value={member.id}>
                            <MemberAvatar name={member.name} className="size-6" />
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TaskStatus).map(status => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <FormControl>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectOptions?.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            <ProjectAvatar name={project.name} image={project.imageUrl} className="size-6" />
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                className={cn(!onCancel && 'invisible')}
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
