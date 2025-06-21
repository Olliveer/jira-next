'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateProjectSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeftIcon, ImageIcon, Loader2Icon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRef } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUpdateProject } from '@/features/projects/api/use-update-project';
import { Project } from '../types';
import { useConfirm } from '@/hooks/use-confirm';
import { useDeleteProject } from '@/features/projects/api/use-delete-project';

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: Project;
}

export function EditProjectForm({ onCancel, initialValues }: EditProjectFormProps) {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletePending } = useDeleteProject();

  const [ConfirmDeleteDialog, confirmDelete] = useConfirm({
    title: 'Delete Project',
    message: 'Are you sure you want to delete this project?',
    variant: 'destructive',
  });

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: initialValues.name,
      image: initialValues.imageUrl ?? '',
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(values: z.infer<typeof updateProjectSchema>) {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };

    mutate({
      form: finalValues,
      param: {
        projectId: initialValues.$id,
      },
    });
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', file);
    }
  }

  async function handleDelete() {
    const ok = await confirmDelete();
    if (!ok) {
      return;
    }

    deleteProject(
      { param: { projectId: initialValues.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${initialValues.workspaceId}`);
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <ConfirmDeleteDialog />
      <Card className="w-full h-full gap-2">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4 mr-1" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">{initialValues.name}</CardTitle>
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
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-5">
                      {field.value ? (
                        <div className="size-[72px] relative rounded-md overflow-hidden">
                          <Image
                            src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}
                            alt="Project Image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <Avatar className="size-[72px]">
                          <AvatarFallback>
                            <ImageIcon className="size-[36px] text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <p className="text-sm">Project Icon</p>
                        <p className="text-xs text-neutral-500">JPG, PNG, SVG, JPEG, max 1mb</p>
                        <input
                          type="file"
                          ref={inputRef}
                          accept=".jpg,.jpeg,.png,.svg"
                          className="hidden"
                          disabled={isPending}
                          onChange={handleImageChange}
                        />
                        {field.value ? (
                          <Button
                            type="button"
                            variant="destructive"
                            className="w-fit mt-2"
                            size="sm"
                            onClick={() => {
                              field.onChange(null);
                              if (inputRef.current) {
                                inputRef.current.value = '';
                              }
                            }}
                            disabled={isPending}
                          >
                            Remove Image
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-fit mt-2"
                            size="sm"
                            onClick={() => inputRef.current?.click()}
                            disabled={isPending}
                          >
                            Upload
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
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
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full h-full">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Be careful when using these options, deleting a project will delete all its data!
            </p>
            <Button
              onClick={handleDelete}
              disabled={isPending || isDeletePending}
              variant="destructive"
              className="mt-6 w-fit ml-auto"
              size="sm"
              type="button"
            >
              {isDeletePending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
