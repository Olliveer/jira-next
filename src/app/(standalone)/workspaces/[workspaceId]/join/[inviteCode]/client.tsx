'use client';

import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form';
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { PageError } from '@/components/page-error';
import PageLoader from '@/components/page-loader';

export function JoinWorkspacePageClient() {
  const workspaceId = useWorkspaceId();
  const { data: workspaceInfo, isLoading } = useGetWorkspaceInfo({ workspaceId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!workspaceInfo) {
    return <PageError message="Workspace not found" />;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={workspaceInfo} />
    </div>
  );
}
