'use client'
import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { subMonths } from "date-fns"
import { startOfMonth } from "date-fns"
import { createContext, useContext, useState } from "react"

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

interface AnalyticsData {
  totalRevenue: number
  totalExpenses: number
  totalOrders: number
  averageOrderValue: number
  revenueByMonth: Array<{
    month: string
    revenue: number
    expenses: number
  }>
  expensesByCategory: Array<{
    category: string
    amount: number
  }>
  topProducts: Array<{
    name: string
    quantity: number
    revenue: number
  }>
}

export type AnalyticsContextType = {
    analytics: AnalyticsData | null
    setTimeRange: (timeRange: string) => void
    isLoading: boolean
    timeRange: string
   
}

const AnalyticsContext = createContext<AnalyticsContextType|undefined>(undefined)

const fetchAnalytics = async (timeRange: string) => {
    try {
        const endDate = new Date()
        const startDate = subMonths(startOfMonth(endDate), parseInt(timeRange) - 1)
        
        const response = await api.get(
          `/analytics?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
        )
        if (response.status !== 200) throw new Error('Failed to fetch analytics')
        return response.data
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } 
}

export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
    const [timeRange, setTimeRange] = useState('6') // months
    const {data, isLoading} = useQuery({
        queryKey: ['analytics', timeRange],
        queryFn: () => fetchAnalytics(timeRange),
        staleTime: 1000 * 60 * 5, // 5 minutes,
    })


    return (
        <AnalyticsContext.Provider value={{ analytics: data, setTimeRange, isLoading, timeRange }}>
            {children}
        </AnalyticsContext.Provider>
    )
}

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext)
    if (!context) {
        throw new Error('useAnalytics must be used within a AnalyticsProvider')
    }
    return context
}



