export interface ExpenseItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    expenseId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Expense {
    id: string;
    description: string;
    amount: number;
    category: string;
    vendor: string;
    date: Date;
    receiptUrl?: string;
    items: ExpenseItem[];
    organizationId?: string;
    personalAccountId?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CreateExpenseDTO {
    description: string;
    amount: number;
    category: string;
    vendor: string;
    date: Date;
    receiptUrl?: string;
    items: Omit<ExpenseItem, 'id' | 'expenseId' | 'createdAt' | 'updatedAt'>[];
  }
  
  export interface ExpenseApiResponse {
    data?: Expense[];
    error?: string;
  }