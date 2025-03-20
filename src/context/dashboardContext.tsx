"use client"
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useState, useEffect } from 'react'
import { DashboardData, TrendMetrics } from "@/lib/types/dashboard";
export interface IDashboardContext {
    data: DashboardData
    trends: TrendMetrics
    loading: boolean
    showFunding: boolean
    setShowFunding: (showFunding: boolean) => void
}


const DashboardContext = createContext<IDashboardContext | null>(null)


const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard')
      if (response.status !== 200) throw new Error('Failed to fetch dashboard data')
      return response.data as DashboardData
    } catch (error) {
        throw error
    }
}

const fetchTrends = async () => {
    try {
      const response = await api.get('/dashboard/trends')
      if (response.status !== 200) throw new Error('Failed to fetch trends')
      return response.data
    } catch (error) {
      throw error
    }
  }





const DashboardProvider = ({children}:{children:React.ReactNode}) => {
    const {data, isLoading} = useQuery({
        queryKey: ['dashboard'],
        queryFn: fetchDashboardData,
    })
    const {data: trends, isLoading: trendsLoading} = useQuery({
        queryKey: ['trends'],
        queryFn: fetchTrends
    })
    const [loading, setLoading] = useState(true)
    const [showFunding, setShowFunding] = useState(false)

    useEffect(()=>{
        if(isLoading || trendsLoading){
            setLoading(true)
        }else{
            setLoading(false)
        }
    },[isLoading, trendsLoading])


    return (
        <DashboardContext.Provider value={{data: data as DashboardData, trends: trends as TrendMetrics, loading, showFunding, setShowFunding}}>
            {children}
        </DashboardContext.Provider>
    )
}

const useDashboard = () => {
    const context = useContext(DashboardContext)
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider')
    }
    return context
}

export {DashboardProvider, useDashboard}

