'use client';

import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { CalendarIcon, PlusIcon, SettingsIcon } from 'lucide-react';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useGetWorkspaceAnalytics } from '@/features/workspaces/api/use-get-workspace-analytics';
import { PageError } from '@/components/page-error';
import PageLoader from '@/components/page-loader';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { Analytics } from '@/components/analytics';
import { Task } from '@/features/tasks/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Project } from '@/features/projects/types';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { Member } from '@/features/members/types';
import { MemberAvatar } from '@/features/members/components/member-avatar';

export function WorkspaceClient() {
  const workspaceId = useWorkspaceId();
  const { data: analytics, isLoading: analyticsIsLoading } = useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: tasksIsLoading } = useGetTasks({ workspaceId });
  const { data: projects, isLoading: projectsIsLoading } = useGetProjects({ workspaceId });
  const { data: members, isLoading: membersIsLoading } = useGetMembers({ workspaceId });

  if (analyticsIsLoading || tasksIsLoading || projectsIsLoading || membersIsLoading) {
    return <PageLoader />;
  }

  if (!analytics || !tasks || !projects || !members) {
    return <PageError message="Workspace not found" />;
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskList data={tasks.documents} total={tasks.total} />
        <ProjectList data={projects.documents} total={projects.total} />
        <MembersList data={members.documents} total={members.total} />
      </div>
    </div>
  );
}

export const TaskList = ({ data, total }: { data: Task[]; total: number }) => {
  const { open: openCreateTaskModal } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>
          <Button variant="outline" size="icon" onClick={() => openCreateTaskModal()}>
            <PlusIcon className="text-neutral-400 size-4" />
          </Button>
        </div>

        <Separator className="my-4" />

        <ul className="flex flex-col gap-y-4">
          {data.map(task => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="border-none shadow-none hover:opacity-75 transition">
                  <CardContent className="p-4 ">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p>{task.project?.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300"></div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-1 size-3" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-center text-sm text-muted-foreground hidden first-of-type:block">No tasks found</li>
        </ul>
        <Button variant="secondary" className="w-full mt-4" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show all tasks</Link>
        </Button>
      </div>
    </div>
  );
};

export const ProjectList = ({ data, total }: { data: Project[]; total: number }) => {
  const { open: openCreateProjectModal } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button variant="secondary" size="icon" onClick={() => openCreateProjectModal()}>
            <PlusIcon className="text-neutral-400 size-4" />
          </Button>
        </div>

        <Separator className="my-4" />

        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map(project => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className=" shadow-none hover:opacity-75 transition">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      name={project.name}
                      image={project.imageUrl}
                      className="size-12"
                      fallbackClassName="text-lg size-8"
                    />
                    <p className="text-lg font-medium truncate">{project.name}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-center text-sm text-muted-foreground hidden first-of-type:block">No projects found</li>
        </ul>
      </div>
    </div>
  );
};

export const MembersList = ({ data, total }: { data: Member[]; total: number }) => {
  const workspaceId = useWorkspaceId();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button variant="secondary" size="icon" asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="text-neutral-400 size-4" />
            </Link>
          </Button>
        </div>

        <Separator className="my-4" />

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map(member => (
            <li key={member.$id}>
              <Card className=" shadow-none overflow-hidden">
                <CardContent className="p-3 flex flex-col items-center gap-x-2">
                  <MemberAvatar name={member.name} className="size-8" fallbackClassName="text-lg size-8" />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-medium line-clamp-1">{member.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{member.email}</p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-center text-sm text-muted-foreground hidden first-of-type:block">No members found</li>
        </ul>
      </div>
    </div>
  );
};
