'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Calendar, DollarSign, FileText, Tag, User, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface ExpenseItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

interface ExpenseDetailsProps {
  expense: {
    id: string;
    amount: number;
    description: string;
    category: string;
    vendor: string;
    date: Date;
    receiptUrl?: string | null;
    items: ExpenseItem[];
    createdBy: string;
  };
}

export default function ExpenseDetails({ expense }: ExpenseDetailsProps) {
  const router = useRouter();

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Expenses
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Main Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Amount</label>
                <div className="flex items-center gap-2 text-2xl font-semibold">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  {expense.amount.toFixed(2)}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Category</label>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{expense.category}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Vendor</label>
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span>{expense.vendor}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Date</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(expense.date), 'PPP')}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Created By</label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {expense.createdBy}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {expense.description || 'No description provided'}
            </p>
          </CardContent>
        </Card>

        {/* Expense Items Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expense Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expense.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      ${item.unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.totalPrice.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${expense.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Receipt Card */}
        {expense.receiptUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Receipt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <a
                  href={expense.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View Receipt
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
