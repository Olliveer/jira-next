import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';

import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { sessionMiddleware } from '@/lib/session-middleware';
import { zValidator } from '@hono/zod-validator';
import { createProjectSchema, updateProjectSchema } from '../schemas';
import { Project } from '../types';

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

    const { name, image, workspaceId } = c.req.valid('form');

    const member = await getMember({ databases, workspaceId: workspaceId!, userId: user.$id });

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
  })
  .patch('/:projectId', sessionMiddleware, zValidator('form', updateProjectSchema), async c => {
    const databases = c.get('databases');
    const storage = c.get('storage');
    const user = c.get('user');

    const { name, image } = c.req.valid('form');
    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

    if (!project) {
      return c.json(
        {
          error: 'Project not found',
        },
        404,
      );
    }

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json(
        {
          error: 'You are not authorized to update this project',
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

    const updatedProject = await databases.updateDocument(DATABASE_ID, PROJECTS_ID, projectId, {
      name,
      imageUrl: uploadedImageUrl,
    });

    return c.json({
      data: updatedProject,
    });
  })
  .delete('/:projectId', sessionMiddleware, zValidator('param', z.object({ projectId: z.string() })), async c => {
    const databases = c.get('databases');
    const user = c.get('user');

    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

    if (!project) {
      return c.json(
        {
          error: 'Project not found',
        },
        404,
      );
    }

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json(
        {
          error: 'You are not authorized to delete this project',
        },
        401,
      );
    }

    //TODO: delete workspace members, boards, lists, cards

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return c.json({
      data: {
        $id: project.$id,
      },
    });
  });

export default app;
