
export interface DashboardMetrics {
    currentFunding: number;
    totalRevenue: number;
    totalExpenses: number;
    totalOrders: number;
    pendingOrders: number;
  }
  
  export interface MonthlyRevenue {
    month: string;
    revenue: number;
    expenses: number;
  }
  
  export interface ExpenseCategory {
    category: string;
    amount: number;
  }
  
  export interface ActivityItem {
    id: string;
    type: 'order' | 'expense';
    title: string;
    amount: number;
    date: Date;
  }
  
  export interface DashboardData {
    metrics: DashboardMetrics;
    revenueByMonth: MonthlyRevenue[];
    expensesByCategory: ExpenseCategory[];
    recentActivity: ActivityItem[];
  }


  export interface TrendMetrics {
    revenue: number;
    orders: number;
    customers: number;
    expenses: number;
    pendingOrders: number;
  }
