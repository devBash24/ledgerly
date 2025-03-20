import { JoinRequest } from '@/lib/types/organization';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Clock } from "lucide-react";
import { format } from 'date-fns';

interface JoinRequestCardProps {
  request: JoinRequest;
  onHandleRequest: (requestId: string, status: 'APPROVED' | 'REJECTED') => void;
}

export function JoinRequestCard({ request, onHandleRequest }: JoinRequestCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <UserPlus className="h-10 w-10 text-muted-foreground" />
            <div>
              <h3 className="font-medium">{request.name || request.email}</h3>
              <p className="text-sm text-muted-foreground">{request.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Requested {format(new Date(request.createdAt), 'PP')}
                </span>
              </div>
            </div>
          </div>
          <div className="space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => onHandleRequest(request.id, 'APPROVED')}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onHandleRequest(request.id, 'REJECTED')}
            >
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default JoinRequestCard;
