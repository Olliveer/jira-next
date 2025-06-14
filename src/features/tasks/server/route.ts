import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from '@/config';
import { createTaskSchema } from '../schemas';
import { sessionMiddleware } from '@/lib/session-middleware';
import { getMember } from '@/features/members/utils';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';
import { Task, TaskStatus } from '../types';
import { createAdminClient } from '@/lib/appwrite';
import { Project } from '@/features/projects/types';

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      }),
    ),
    async c => {
      const { users } = await createAdminClient();
      const databases = c.get('databases');
      const user = c.get('user');

      const { workspaceId, projectId, assigneeId, status, search, dueDate } = c.req.valid('query');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json(
          {
            error: 'You are not authorized to view this workspace',
          },
          401,
        );
      }

      const query = [Query.equal('workspaceId', workspaceId), Query.orderDesc('$createdAt')];

      if (projectId) {
        query.push(Query.equal('projectId', projectId));
      }

      if (assigneeId) {
        query.push(Query.equal('assigneeId', assigneeId));
      }

      if (status) {
        query.push(Query.equal('status', status));
      }

      if (search) {
        query.push(Query.search('name', search));
      }

      if (dueDate) {
        query.push(Query.equal('dueDate', dueDate));
      }

      const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, query);

      const projectIds = tasks.documents.map(task => task.projectId);
      const assigneeIds = tasks.documents.map(task => task.assigneeId);

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains('$id', projectIds)] : [],
      );

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains('$id', assigneeIds)] : [],
      );

      const assignees = await Promise.all(
        members.documents.map(async member => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        }),
      );

      const populatedTasks = await Promise.all(
        tasks.documents.map(async task => {
          const project = projects.documents.find(project => project.$id === task.projectId);

          const assignee = assignees.find(member => member.$id === task.assigneeId);

          return {
            ...task,
            project,
            assignee,
          };
        }),
      );

      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    },
  )
  .post('/', sessionMiddleware, zValidator('json', createTaskSchema), async c => {
    const databases = c.get('databases');
    const user = c.get('user');

    const { name, description, status, workspaceId, projectId, dueDate, assigneeId } = c.req.valid('json');

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json(
        {
          error: 'You are not authorized to create a task in this project',
        },
        401,
      );
    }

    const highestPositionTask = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('status', status),
      Query.equal('workspaceId', workspaceId),
      Query.orderAsc('position'),
      Query.limit(1),
    ]);

    const newPosition =
      highestPositionTask.documents.length > 0 ? highestPositionTask.documents[0].position + 1000 : 1000;

    const task = await databases.createDocument(DATABASE_ID, TASKS_ID, ID.unique(), {
      name,
      status,
      workspaceId,
      projectId,
      dueDate,
      assigneeId,
      description,
      position: newPosition,
    });

    return c.json({
      data: task,
    });
  })
  .delete('/:taskId', sessionMiddleware, async c => {
    const databases = c.get('databases');
    const user = c.get('user');

    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

    if (!task) {
      return c.json(
        {
          error: 'Task not found',
        },
        404,
      );
    }

    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json(
        {
          error: 'You are not authorized to delete this task',
        },
        401,
      );
    }

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

    return c.json({
      data: {
        $id: taskId,
      },
    });
  })
  .patch('/:taskId', sessionMiddleware, zValidator('json', createTaskSchema.partial()), async c => {
    const databases = c.get('databases');
    const user = c.get('user');

    const { name, description, status, projectId, dueDate, assigneeId } = c.req.valid('json');

    const { taskId } = c.req.param();

    const taskToUpdate = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

    if (!taskToUpdate) {
      return c.json(
        {
          error: 'Task not found',
        },
        404,
      );
    }

    const member = await getMember({
      databases,
      workspaceId: taskToUpdate.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json(
        {
          error: 'You are not authorized to create a task in this project',
        },
        401,
      );
    }

    const task = await databases.updateDocument(DATABASE_ID, TASKS_ID, taskId, {
      name,
      status,
      projectId,
      dueDate,
      assigneeId,
      description,
    });

    return c.json({
      data: task,
    });
  })
  .get('/:taskId', sessionMiddleware, async c => {
    const user = c.get('user');
    const databases = c.get('databases');
    const { users } = await createAdminClient();

    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

    if (!task) {
      return c.json(
        {
          error: 'Task not found',
        },
        404,
      );
    }

    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json(
        {
          error: 'You are not authorized to view this task',
        },
        401,
      );
    }

    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, task.projectId);

    const assigneeUser = await users.get(member.userId);

    const assignee = {
      ...member,
      name: assigneeUser.name,
      email: assigneeUser.email,
    };

    return c.json({
      data: {
        ...task,
        project,
        assignee,
      },
    });
  })
  .post(
    '/bulk-update',
    sessionMiddleware,
    zValidator(
      'json',
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().min(1000).max(1000000),
          }),
        ),
      }),
    ),
    async c => {
      const databases = c.get('databases');
      const { tasks } = c.req.valid('json');
      const user = c.get('user');

      const tasksToUpdate = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.contains(
          '$id',
          tasks.map(task => task.$id),
        ),
      ]);

      const workspaceIds = new Set(tasksToUpdate.documents.map(task => task.workspaceId));

      if (workspaceIds.size !== 1) {
        return c.json(
          {
            error: 'You are not authorized to update tasks from different workspaces',
          },
          401,
        );
      }

      const workspaceId = workspaceIds.values().next().value;

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json(
          {
            error: 'You are not authorized to update tasks in this workspace',
          },
          401,
        );
      }

      const updatedTasks = await Promise.all(
        tasks.map(async task => {
          const updatedTask = await databases.updateDocument(DATABASE_ID, TASKS_ID, task.$id, {
            status: task.status,
            position: task.position,
          });
          return updatedTask;
        }),
      );

      return c.json({
        data: updatedTasks,
      });
    },
  );

export default app;
