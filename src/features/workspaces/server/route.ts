import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createWorkspaceSchema, updateWorkspaceSchema } from '../schemas';
import { sessionMiddleware } from '@/lib/session-middleware';
import { WORKSPACES_ID, DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID } from '@/config';
import { ID, Query } from 'node-appwrite';
import { MemberRole } from '@/features/members/types';
import { genereateInviteCode } from '@/lib/utils';
import { getMember } from '@/features/members/utils';
import z from 'zod';
import { Workspace } from '../types';

const app = new Hono()
  .get('/', sessionMiddleware, async c => {
    const databases = c.get('databases');
    const user = c.get('user');

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal('userId', user.$id)]);

    if (members.total === 0) {
      return c.json({
        data: {
          documents: [],
          total: 0,
        },
      });
    }

    const workspaceIds = members.documents.map(member => member.workspaceId);

    const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
      Query.orderDesc('$createdAt'),
      Query.contains('$id', workspaceIds),
    ]);

    return c.json({
      data: workspaces,
    });
  })
  .get('/:workspaceId', sessionMiddleware, zValidator('param', z.object({ workspaceId: z.string() })), async c => {
    const databases = c.get('databases');
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: c.get('user').$id,
    });

    if (!member) {
      return c.json(
        {
          error: 'You are not authorized to view this workspace',
        },
        401,
      );
    }

    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    if (!workspace) {
      return c.json(
        {
          error: 'Workspace not found',
        },
        404,
      );
    }

    return c.json({
      data: workspace,
    });
  })
  .get('/:workspaceId/info', sessionMiddleware, zValidator('param', z.object({ workspaceId: z.string() })), async c => {
    const databases = c.get('databases');
    const { workspaceId } = c.req.param();

    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    if (!workspace) {
      return c.json(
        {
          error: 'Workspace not found',
        },
        404,
      );
    }

    return c.json({
      data: {
        $id: workspace.$id,
        name: workspace.name,
        imageUrl: workspace.imageUrl,
      },
    });
  })
  .post('/', zValidator('form', createWorkspaceSchema), sessionMiddleware, async c => {
    const databases = c.get('databases');
    const storage = c.get('storage');
    const user = c.get('user');

    const { name, image } = c.req.valid('form');

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);

      const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, file.$id);

      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    }

    const workspace = await databases.createDocument(DATABASE_ID, WORKSPACES_ID, ID.unique(), {
      name,
      userId: user.$id,
      imageUrl: uploadedImageUrl,
      inviteCode: genereateInviteCode({ length: 10 }),
    });

    await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
      workspaceId: workspace.$id,
      userId: user.$id,
      role: MemberRole.ADMIN,
    });

    return c.json({
      data: workspace,
    });
  })
  .patch('/:workspaceId', sessionMiddleware, zValidator('form', updateWorkspaceSchema), async c => {
    const databases = c.get('databases');
    const storage = c.get('storage');
    const user = c.get('user');

    const { name, image } = c.req.valid('form');
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json(
        {
          error: 'You are not authorized to update this workspace',
        },
        401,
      );
    }

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);

      const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, file.$id);

      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    } else {
      uploadedImageUrl = image;
    }

    const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, {
      name,
      userId: user.$id,
      imageUrl: uploadedImageUrl,
    });

    return c.json({
      data: workspace,
    });
  })
  .delete('/:workspaceId', sessionMiddleware, async c => {
    const databases = c.get('databases');
    const user = c.get('user');

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json(
        {
          error: 'You are not authorized to delete this workspace',
        },
        401,
      );
    }

    //TODO: delete workspace members, boards, lists, cards

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({
      data: {
        $id: workspaceId,
      },
    });
  })
  .post('/:workspaceId/reset-invite-code', sessionMiddleware, async c => {
    const databases = c.get('databases');
    const user = c.get('user');

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json(
        {
          error: 'You are not authorized to delete this workspace',
        },
        401,
      );
    }

    const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, {
      inviteCode: genereateInviteCode({ length: 10 }),
    });

    return c.json({
      data: workspace,
    });
  })
  .post('/:workspaceId/join', sessionMiddleware, zValidator('json', z.object({ code: z.string() })), async c => {
    const databases = c.get('databases');
    const user = c.get('user');

    const { workspaceId } = c.req.param();
    const { code } = c.req.valid('json');

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (member) {
      return c.json(
        {
          error: 'You are already a member of this workspace',
        },
        400,
      );
    }

    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    if (workspace.inviteCode !== code) {
      return c.json(
        {
          error: 'Invalid invite code',
        },
        400,
      );
    }

    await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
      workspaceId,
      userId: user.$id,
      role: MemberRole.MEMBER,
    });

    return c.json({
      data: workspace,
    });
  });

export default app;
