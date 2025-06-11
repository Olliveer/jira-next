import { z } from 'zod';

export const createProjectSchema = z.object({
  workspaceId: z.string().trim().min(1, { message: 'Workspace ID is required' }).optional(),
  name: z.string().trim().min(1, { message: 'Name is required' }),
  image: z.union([z.instanceof(File), z.string().transform(value => (value === '' ? undefined : value))]).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }).optional(),
  image: z.union([z.instanceof(File), z.string().transform(value => (value === '' ? undefined : value))]).optional(),
});
