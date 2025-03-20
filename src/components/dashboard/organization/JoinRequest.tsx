import { JoinRequest } from '@/lib/types/organization';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

interface JoinRequestsProps {
  requests: JoinRequest[];
  onHandleRequest: (requestId: string, status: 'APPROVED' | 'REJECTED') => void;
}

export function JoinRequests({ requests, onHandleRequest }: JoinRequestsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Requests</CardTitle>
        <CardDescription>Manage pending join requests</CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-muted-foreground">No pending requests</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{request.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Requested {format(new Date(request.createdAt), 'PP')}
                  </p>
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
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default JoinRequests;
