import 'server-only';

import { createMiddleware } from 'hono/factory';
import { AUTH_COOKIE_NAME } from '@/features/auth/constants';
import {
  Client,
  Databases,
  Storage,
  Account,
  Models,
  type Account as AccountType,
  type Users as UsersType,
  type Databases as DatabasesType,
  type Storage as StorageType,
} from 'node-appwrite';
import { getCookie } from 'hono/cookie';

type AdditionalContext = {
  Variables: {
    account: AccountType;
    databases: DatabasesType;
    storage: StorageType;
    users: UsersType;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(async (c, next) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

  const session = getCookie(c, AUTH_COOKIE_NAME);

  if (!session) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  client.setSession(session);

  const account = new Account(client);
  const databases = new Databases(client);
  const storage = new Storage(client);

  const user = await account.get();

  if (!user) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  c.set('user', user);
  c.set('account', account);
  c.set('databases', databases);
  c.set('storage', storage);

  await next();
});
