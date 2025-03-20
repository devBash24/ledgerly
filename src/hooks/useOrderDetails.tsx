"use client"
import api from "@/lib/axios"
import { AdditionalFee, OrderItem } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { OrderAction, performOrderAction } from "./useOrders"



export interface Order {
    id: string
    customerName: string
    description: string | null
    address: string
    deliveryTime: string
    isCompleted: boolean
    totalAmount: number
    orderItems: OrderItem[]
    additionalFees: AdditionalFee[]
    createdAt: string
  }


export const useOrderDetails = (id: string) => {
    const query = useQuery({
        queryKey: ["orderDetails"],
        queryFn: () => getOrder(id)
    })

    const {mutateAsync:orderAction, isPending:isOrderActionPending} = useMutation({
        mutationKey: ["orders",id],
        mutationFn: async (data: OrderAction) => performOrderAction(data),
        onSuccess: () => {
            query.refetch()
        }
       
    })

    return{
        query,
        orderAction,
        isOrderActionPending
    }
}


const getOrder = async (id: string) => {
    try {
      const response = await api.get(`/orders/${id}`)
      if (response.status !== 200) throw new Error('Failed to fetch order')
      return response.data
    } catch (error) {
      console.error('Error fetching order:', error)
      throw error
    } 
  }