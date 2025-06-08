import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';

import { sessionMiddleware } from '@/lib/session-middleware';
import { zValidator } from '@hono/zod-validator';
import { getMember } from '@/features/members/utils';
import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from '@/config';
import { createProjectSchema } from '../schemas';

const app = new Hono()
  .get('/', sessionMiddleware, zValidator('query', z.object({ workspaceId: z.string() })), async c => {
    const user = c.get('user');
    const databases = c.get('databases');
    const { workspaceId } = c.req.valid('query');

    if (!workspaceId) {
      return c.json(
        {
          error: 'Workspace ID is required',
        },
        400,
      );
    }

    const member = await getMember({ databases, workspaceId, userId: user.$id });

    if (!member) {
      return c.json(
        {
          error: 'You are not authorized to view this workspace',
        },
        401,
      );
    }

    const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
      Query.equal('workspaceId', workspaceId),
      Query.orderDesc('$createdAt'),
    ]);

    return c.json({
      data: projects,
    });
  })
  .post('/', sessionMiddleware, zValidator('form', createProjectSchema), async c => {
    const databases = c.get('databases');
    const storage = c.get('storage');
    const user = c.get('user');

    const { workspaceId, name, image } = c.req.valid('form');

    const member = await getMember({ databases, workspaceId, userId: user.$id });

    if (!member) {
      return c.json(
        {
          error: 'You are not authorized to create a project',
        },
        401,
      );
    }

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);

      const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, file.$id);

      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    }

    const project = await databases.createDocument(DATABASE_ID, PROJECTS_ID, ID.unique(), {
      name,
      workspaceId,
      imageUrl: uploadedImageUrl,
    });

    return c.json({
      data: project,
    });
  });

export default app;
