"use client"
import api from "@/lib/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

interface OrderItem {
    id: string
    name: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }
  
  interface Order {
    id: string
    customerName: string
    description: string | null
    address: string
    deliveryTime: string
    isCompleted: boolean
    totalAmount: number
    orderItems: OrderItem[]
    createdAt: string
  }

  export interface OrderAction{
    action: 'toggle' | 'delete'
    orderId: string
  }

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders')
      if (response.status !== 200) throw new Error('Failed to fetch orders')
      return response.data as Order[]
    } catch (error) {
        throw error
    } 
  }

export const performOrderAction = async ({action, orderId}: OrderAction) => {
    try {
        const response = await api.post('/orders/action', {action, orderId})
        if (response.status !== 200) throw new Error('Failed to perform order action')
        return response.data
    } catch (error) {
        throw error
    }
  }



export const useOrders = () => {
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all')
    const [sortConfig, setSortConfig] = useState<{
      key: keyof Order
      direction: 'asc' | 'desc'
    }>({
        key: 'createdAt',
        direction: 'desc'
    })
    const {data, isLoading, error} = useQuery({
        queryKey: ['orders'],
        queryFn: () => fetchOrders(),
        initialData: []
    })

    const {mutateAsync: orderAction, isPending: isPerformingAction} = useMutation({
        mutationFn: (action: OrderAction) => performOrderAction(action),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['orders',]})
            toast.success('Order action performed successfully')
        },
        onError: (error) => {
            toast.error('Failed to perform order action')
        }
    })



    const filteredAndSortedOrders = data
    .filter((order: Order) => {
      const matchesSearch = order.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && order.isCompleted) ||
        (statusFilter === 'pending' && !order.isCompleted)
      return matchesSearch && matchesStatus
    })
    .sort((a: Order, b: Order) => {
      const { key, direction } = sortConfig
      const modifier = direction === 'asc' ? 1 : -1
      
      if (key === 'totalAmount') {
        return (a[key] - b[key]) * modifier
      }
      
      return (
        (a[key]?.toString() || '').localeCompare(b[key]?.toString() || '') * modifier
      )
    })

    
  const handleSort = (key: keyof Order) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    })
  }
   return{
    orders: filteredAndSortedOrders,
    isLoading,
    error,
    searchTerm,
    statusFilter,
    sortConfig,
    handleSort,
    setSearchTerm,
    setStatusFilter,
    orderAction,
    isPerformingAction
   } 
}
