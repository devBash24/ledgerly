'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  DollarSign, 
  ShoppingCart, 
  Package,
  Eye,
  EyeOff,
  CreditCard
} from "lucide-react"
import { MetricCard } from './MetricCard'
import { RecentActivity } from './RecentActivity'
import { useDashboard } from '@/context/dashboardContext'
import RevenueOverviewChart from './RevenueOverviewChart'
import ExpensesCategoryChart from './ExpensesCategoryChart'
import DashboardSkeleton from './DashboardSkeleton'
export default function Dashboard() {
  const {data, trends, loading, showFunding, setShowFunding} = useDashboard()
  if (loading || !data) {
    return <DashboardSkeleton />
  }
  return (
    <div className="space-y-6">
      {/* First Row - Funding and Revenue */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Current Funding */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Funding</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFunding(!showFunding)}
            >
              {showFunding ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showFunding ? (
                `$${data.metrics.currentFunding?.toLocaleString() ?? '0'}`
              ) : (
                '••••••'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Updated with latest transactions
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <div>
          <MetricCard
            title="Total Revenue"
            value={`$${data.metrics.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="w-4 h-4" />}
            trend={trends?.revenue ?? 0}
            description="vs. previous 30 days"
          />
        </div>
      </div>

      {/* Second Row - Expenses, Orders, and Pending Orders */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <MetricCard
            title="Total Expenses"
            value={`$${data.metrics.totalExpenses.toLocaleString()}`}
            icon={<CreditCard className="w-4 h-4" />}
            trend={trends?.expenses ?? 0}
            description="vs. previous 30 days"
          />
        </div>
        <div>
          <MetricCard
            title="Total Orders"
            value={data.metrics.totalOrders}
            icon={<ShoppingCart className="w-4 h-4" />}
            trend={trends?.orders ?? 0}
            description="vs. previous 30 days"
          />
        </div>
        <div>
          <MetricCard
            title="Pending Orders"
            value={data.metrics.pendingOrders}
            icon={<Package className="w-4 h-4" />}
            trend={trends?.pendingOrders ?? 0}
            description="vs. previous 30 days"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Overview Chart */}
        <RevenueOverviewChart />

        {/* Expenses by Category Chart */}
        <ExpensesCategoryChart />
      </div>

      {/* Recent Activity Section */}
      <div className="w-full">
        <RecentActivity activities={data.recentActivity} />
      </div>
    </div>
  )
}
