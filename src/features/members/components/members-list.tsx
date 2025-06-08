'use client';

import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2Icon, MoreVerticalIcon } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { Fragment } from 'react';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteMember } from '@/features/members/api/use-delete-member';
import { useUpdateMember } from '@/features/members/api/use-update-member';
import { MemberRole } from '../types';
import { useConfirm } from '@/hooks/use-confirm';
import { useRouter } from 'next/navigation';

export function MembersList() {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data, isPending } = useGetMembers({ workspaceId });
  const {
    mutate: deleteMember,
    isPending: isDeleteMemberPending,
    variables: deleteMemberVariables,
  } = useDeleteMember();
  const { mutate: updateMember, isPending: isUpdateMemberPending } = useUpdateMember();

  const [ConfirmDialog, confirmDelete] = useConfirm({
    title: 'Delete member',
    message: 'Are you sure you want to delete this member?',
    variant: 'destructive',
  });

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirmDelete();
    if (!ok) {
      return;
    }
    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          // TODO: maybe hard reload
          router.refresh();
        },
      },
    );
  };

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ param: { memberId }, json: { role } });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2Icon className="size-4 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="p-7 flex flex-row items-center gap-x-4 space-y-0">
        <Button variant="outline" asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeft className="size-4" /> Back
          </Link>
        </Button>
        <CardTitle>Members List</CardTitle>
      </CardHeader>
      {/* <div className="py-7">
        <Separator className="" />
      </div> */}
      <CardContent className="p-7">
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar className="size-10" fallbackClassName="text-lg" name={member.name} />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={isDeleteMemberPending || isUpdateMemberPending}
                    variant="ghost"
                    size="icon"
                    className="ml-auto"
                  >
                    {(isDeleteMemberPending || isUpdateMemberPending) &&
                    deleteMemberVariables?.param.memberId === member.$id ? (
                      <Loader2Icon className="size-4 animate-spin" />
                    ) : (
                      <MoreVerticalIcon className="size-4 text-muted-foreground" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)}
                    className="font-medium"
                  >
                    Set as Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)}
                    className="font-medium"
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteMember(member.$id)}
                    className="font-medium text-amber-700"
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.documents.length - 1 ? <Separator className="my-2.5 " /> : null}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
