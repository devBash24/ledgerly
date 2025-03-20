"use client"
import api from "@/lib/axios"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
interface Settings {
    businessName: string
    businessEmail: string
    currency: string
    businessFunding: number
    notificationsEnabled: boolean
    emailNotifications: boolean
  }
  

const fetchSettings = async () => {
    try {
      const response = await api.get('/settings')
      if (response.status !== 200) throw new Error('Failed to fetch settings')
      return response.data
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

const updateSettings = async (data: Settings) => {
    try {
        const response = await api.post('/settings', data)
        if (response.status !== 200) throw new Error('Failed to save settings')
        return response.data
      } catch (error) {
        console.error('Error saving settings:', error)
       throw error
      } 
  }

const initialSettings: Settings = {
    businessName: '',
    businessEmail: '',
    currency: 'USD',
    businessFunding: 0,
    notificationsEnabled: true,
    emailNotifications: true
}
export const useSettings = () => {
    const queryClient = useQueryClient()
    const [showFunding, setShowFunding] = useState(false)    
    const [settingsData, setSettingsData] = useState(initialSettings)

    const {data, isLoading:settingsLoading} = useQuery({
        queryKey: ['settings'],
        queryFn: () => fetchSettings(),
    })

    // Update settingsData when query data changes
    useEffect(() => {
        if (data) {
            console.log(data)
            setSettingsData(data)
        }
    }, [data])

    const {mutateAsync:updateSettingsMutation, isPending:settingsUpdating} = useMutation({
        mutationFn: (data: Settings) => updateSettings(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] })
            toast.success('Settings updated successfully')
        },
        onError: (error) => {
            toast.error('Failed to update settings')
            console.error('Error updating settings:', error)
        }
    })

    return {
        settingsData,
        setSettingsData,
        settingsLoading,
        updateSettingsMutation,
        settingsUpdating,
        showFunding,
        setShowFunding
    }
}

