'use client';

import { EditWorkspaceForm } from '@/features/workspaces/components/edit-workspace-form';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import PageLoader from '@/components/page-loader';
import { PageError } from '@/components/page-error';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';

export default function WorkspaceSettingsClient() {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace({ workspaceId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Workspace not found" />;
  }

  const initialValues = data;

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
}
