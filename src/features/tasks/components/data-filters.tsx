import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectSeparator } from '@/components/ui/select';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { FolderIcon, ListChecksIcon, UserIcon } from 'lucide-react';
import { TaskStatus } from '../types';
import { useTaskFilters } from '../hooks/use-task-filters';
import { DatePicker } from '@/components/date-picker';

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export function DataFilters({ hideProjectFilter }: DataFiltersProps) {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.documents.map(project => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = members?.documents.map(member => ({
    id: member.$id,
    name: member.name,
  }));

  const [{ projectId, status, assigneeId, search, dueDate }, setFilters] = useTaskFilters();

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      setFilters({ status: null });
    } else {
      setFilters({ status: value as TaskStatus });
    }
  };

  const handleAssigneeChange = (value: string) => {
    if (value === 'all') {
      setFilters({ assigneeId: null });
    } else {
      setFilters({ assigneeId: value });
    }
  };

  const handleProjectChange = (value: string) => {
    if (value === 'all') {
      setFilters({ projectId: null });
    } else {
      setFilters({ projectId: value });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select defaultValue={status ?? undefined} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue={assigneeId ?? undefined} onValueChange={handleAssigneeChange}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map(member => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue={projectId ?? undefined} onValueChange={handleProjectChange}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <FolderIcon className="size-4 mr-2" />
            <SelectValue placeholder="All projects" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>
          <SelectSeparator />
          {projectOptions?.map(project => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DatePicker
        value={dueDate ? new Date(dueDate) : undefined}
        className="w-full lg:w-auto h-9'"
        onChange={value => setFilters({ dueDate: value ? value.toISOString() : null })}
        placeholder="Due Date"
      />
    </div>
  );
}
