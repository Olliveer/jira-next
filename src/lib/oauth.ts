'use server';

import { redirect } from 'next/navigation';
import { OAuthProvider } from 'node-appwrite';
import { createAdminClient } from './appwrite';

export async function signUpWithGithub() {
  const { account } = await createAdminClient();

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Github,
    `${process.env.NEXT_PUBLIC_API_URL}/oauth`,
    `${process.env.NEXT_PUBLIC_API_URL}/sign-up`,
  );

  return redirect(redirectUrl);
}
