'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useJoinWorkspace } from '../api/use-join-workspace';
import { Loader2 } from 'lucide-react';
import { useInviteCode } from '../hooks/use-invite-code';
import { useRouter } from 'next/navigation';
import { useWorkspaceId } from '../hooks/use-workspace-id';

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  };
}

export function JoinWorkspaceForm({ initialValues }: JoinWorkspaceFormProps) {
  const router = useRouter();
  const { mutate, isPending } = useJoinWorkspace();
  const workspaceId = useWorkspaceId();

  const inviteCode = useInviteCode();

  const handleSubmit = () => {
    mutate(
      {
        param: {
          workspaceId,
        },
        json: {
          code: inviteCode,
        },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      },
    );
  };

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          You have been invited to join <strong>{initialValues.name}</strong> workspace
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row items-center justify-end gap-2">
          <Button disabled={isPending} asChild type="button" className="w-full lg:w-fit" variant="outline">
            <Link href="/">Cancel</Link>
          </Button>
          <Button disabled={isPending} type="button" onClick={handleSubmit} className="w-full lg:w-fit">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
