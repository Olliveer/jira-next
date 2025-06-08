import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, registerSchema } from '@/features/auth/schemas';
import { createAdminClient } from '@/lib/appwrite';
import { ID } from 'node-appwrite';
import { deleteCookie, setCookie } from 'hono/cookie';
import { AUTH_COOKIE_NAME } from '@/features/auth/constants';
import { sessionMiddleware } from '@/lib/session-middleware';

const app = new Hono()
  .get('/current', sessionMiddleware, async c => {
    const user = c.get('user');

    return c.json({
      data: user,
    });
  })
  .post('/login', zValidator('json', loginSchema), async c => {
    try {
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
    } catch (error) {
      console.info('Login failed', error);
      return c.json(
        {
          error: `${error}`,
        },
        400,
      );
    }
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
  .post('/logout', sessionMiddleware, async c => {
    const account = c.get('account');

    deleteCookie(c, AUTH_COOKIE_NAME);
    await account.deleteSession('current');

    return c.json({
      message: 'Logout successful',
    });
  });

export default app;
