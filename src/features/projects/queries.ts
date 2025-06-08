import { createSessionClient } from '@/lib/appwrite';
import { Project } from '@/features/projects/types';
import { getMember } from '@/features/members/utils';
import { DATABASE_ID, PROJECTS_ID } from '@/config';

interface GetProjectProps {
  projectId: string;
}

export const getProject = async ({ projectId }: GetProjectProps) => {
  try {
    const { databases, account } = await createSessionClient();

    const user = await account.get();

    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

    const member = await getMember({ databases, workspaceId: project.workspaceId, userId: user.$id });

    if (!member) {
      return null;
    }

    return project;
  } catch (error) {
    console.info('[getProject]', error);
    return null;
  }
};
