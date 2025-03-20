import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileX } from 'lucide-react';
import Link from 'next/link';

export default function ExpenseNotFound() {
  return (
    <div className="container max-w-md py-16">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <FileX className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle>Expense Not Found</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard/expenses">Back to Expenses</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
