import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ExpenseDetails from '@/components/dashboard/expenses/ExpenseDetails';

interface ExpensePageProps {
  params: {
    id: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: ExpensePageProps): Promise<Metadata> {
  const expense = await prisma.expense.findUnique({
    where: { id: params.id },
    select: { description: true, amount: true }
  });

  if (!expense) {
    return {
      title: 'Expense Not Found'
    };
  }

  return {
    title: `Expense - ${expense.amount.toFixed(2)}`,
    description: expense.description || 'Expense details'
  };
}

// Server-side data fetching
async function getExpense(id: string) {
  const expense = await prisma.expense.findUnique({
    where: { id },
    include: {
      items: true,
    },
   
  });

  if (!expense) {
    notFound();
  }

  return expense;
}

export default async function ExpensePage({ params }: ExpensePageProps) {
  const expense = await getExpense(params.id);
  return <ExpenseDetails expense={expense} />;
}