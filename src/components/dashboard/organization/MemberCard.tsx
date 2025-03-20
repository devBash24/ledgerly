import { OrganizationMember, PERMISSIONS } from '@/lib/types/organization';
import { Permission, Role } from '@prisma/client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MemberCardProps {
  member: OrganizationMember;
  onUpdatePermission: (memberId: string, permission: Permission, value: boolean) => void;
  onRemoveMember: (memberId: string) => void;
  currentUserId: string;
}

export function MemberCard({ member, onUpdatePermission, onRemoveMember, currentUserId }: MemberCardProps) {
  const isAdmin = member.role === Role.ADMIN
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <UserCircle className="h-10 w-10 text-muted-foreground" />
            <div>
              <h3 className="font-medium">{member.user.name}</h3>
              <p className="text-sm text-muted-foreground">{member.user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isAdmin ? "default" : "secondary"}>
              {isAdmin ? 
                <Shield className="h-3 w-3 mr-1" /> : 
                null
              }
              {member.role}
            </Badge>
            {!isAdmin && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemoveMember(member.id)}
              >
                Remove
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {PERMISSIONS.map((permission) => (
            <TooltipProvider key={permission.key}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">
                      {permission.label}
                    </span>
                    <Switch
                      checked={member.permissions.includes(permission.key)}
                      onCheckedChange={(checked) => 
                        onUpdatePermission(member.id, permission.key, checked)
                      }
                      disabled={
                        isAdmin ||
                        (permission.key === Permission.MANAGE_TEAM) ||
                        (permission.key === Permission.MANAGE_SETTINGS && !isAdmin)
                      }
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{permission.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
