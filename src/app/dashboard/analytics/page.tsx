import { AnalyticsDashboard } from "@/components/dashboard/analytics/AnalyticsDashboard"
import { AnalyticsProvider } from "@/context/analyticsContext"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "Analytics | Business Tracker",
  description: "Business performance analytics and insights",
}

export default function AnalyticsPage() {
    return (
      <AnalyticsProvider>
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your business performance and insights
        </p>
      </div>

      <AnalyticsDashboard />
    </div>
    </AnalyticsProvider>
  )
} 