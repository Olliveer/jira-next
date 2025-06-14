'use server';

import { Query } from 'node-appwrite';
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { Workspace } from './types';
import { createSessionClient } from '@/lib/appwrite';

interface GetWorkspaceProps {
  workspaceId: string;
}

interface GetWorkspaceInfoProps {
  workspaceId: string;
}

export const getWorkspaces = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal('userId', user.$id)]);

    if (members.total === 0) {
      return {
        documents: [],
        total: 0,
      };
    }

    const workspaceIds = members.documents.map(member => member.workspaceId);

    const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
      Query.orderDesc('$createdAt'),
      Query.contains('$id', workspaceIds),
    ]);

    return workspaces;
  } catch (error) {
    console.info('[getCurrent]', error);
    return {
      documents: [],
      total: 0,
    };
  }
};

export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
  try {
    const { databases, account } = await createSessionClient();

    const user = await account.get();

    const member = await getMember({ databases, workspaceId, userId: user.$id });

    if (!member) {
      throw new Error('Member not found');
    }

    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return workspace;
  } catch (error) {
    console.info('[getCurrent]', error);
    throw error;
  }
};

export const getWorkspaceInfo = async ({ workspaceId }: GetWorkspaceInfoProps) => {
  try {
    const { databases } = await createSessionClient();

    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return {
      name: workspace.name,
    };
  } catch (error) {
    console.info('[getWorkspaceInfo]', error);
    return null;
  }
};
