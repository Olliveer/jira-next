import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, registerSchema } from '../auth/schemas';
import { createAdminClient } from '@/lib/appwrite';
import { ID } from 'node-appwrite';
import { deleteCookie, setCookie } from 'hono/cookie';
import { AUTH_COOKIE_NAME } from '../auth/constants';

const app = new Hono()
  .post('/login', zValidator('json', loginSchema), async c => {
    const { email, password } = c.req.valid('json');

    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE_NAME, session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({
      message: 'Login successful',
    });
  })
  .post('/register', zValidator('json', registerSchema), async c => {
    const { name, email, password } = c.req.valid('json');

    const { account } = await createAdminClient();

    await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE_NAME, session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({
      message: `Welcome ${name}`,
    });
  })
  .post('/logout', async c => {
    const { account } = await createAdminClient();

    await account.deleteSession('current');

    deleteCookie(c, AUTH_COOKIE_NAME);

    return c.json({
      message: 'Logout successful',
    });
  });

export default app;
