import { OrganizationMember, JoinRequest } from '@/lib/types/organization';
import { Permission } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { MemberCard } from './MemberCard';
import { JoinRequestCard } from './JoinRequestCard';

interface MembersListProps {
  members: OrganizationMember[];
  joinRequests: JoinRequest[];
  onUpdatePermission: (memberId: string, permission: Permission, value: boolean) => void;
  onRemoveMember: (memberId: string) => void;
  onHandleRequest: (requestId: string, status: 'APPROVED' | 'REJECTED') => void;
  organizationCode: string;
  currentUserId: string;
}

export function MembersList({ 
  members, 
  joinRequests, 
  onUpdatePermission, 
  onRemoveMember, 
  onHandleRequest, 
  organizationCode,
  currentUserId 
}: MembersListProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(organizationCode);
      toast.success('Organization code copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Organization Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <code className="text-sm font-mono">{organizationCode}</code>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Share this code with others to let them join your organization
          </p>
        </CardContent>
      </Card>

      {joinRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Join Requests</h2>
          <div className="grid gap-4">
            {joinRequests.map((request) => (
              <JoinRequestCard
                key={request.id}
                request={request}
                onHandleRequest={onHandleRequest}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Team Members</h2>
        <div className="grid gap-4">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onUpdatePermission={onUpdatePermission}
              onRemoveMember={onRemoveMember}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MembersList;
