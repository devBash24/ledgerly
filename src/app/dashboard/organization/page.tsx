// src/app/dashboard/organization/page.tsx
'use client';

import { useOrganization } from '@/hooks/useOrganization';
import { MembersList } from '@/components/dashboard/organization/MemberList';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function OrganizationPage() {
  const {
    members,
    joinRequests,
    isLoading,
    updatePermission,
    removeMember,
    handleJoinRequest,
    organizationCode,
    currentUserId,
  } = useOrganization();

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-[100px] w-full" />
        <Separator />
        <div className="grid gap-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Organization Management</h1>
        <p className="text-muted-foreground">
          Manage your team members and handle join requests
        </p>
      </div>

      <MembersList
        members={members}
        joinRequests={joinRequests}
        organizationCode={organizationCode}
        currentUserId={currentUserId}
        onUpdatePermission={updatePermission}
        onRemoveMember={removeMember}
        onHandleRequest={handleJoinRequest}
      />
    </div>
  );
}