'use server';

import { cookies } from 'next/headers';
import { Account, Client } from 'node-appwrite';
import { AUTH_COOKIE_NAME } from './constants';

export const getCurrent = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

    const session = (await cookies()).get(AUTH_COOKIE_NAME);

    if (!session) {
      return null;
    }

    client.setSession(session.value);

    const account = new Account(client);

    return await account.get();
  } catch (error) {
    console.error('[getCurrent]', error);
    return null;
  }
};
