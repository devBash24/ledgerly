import api from "@/lib/axios"
import { handleError, parseError } from "@/lib/parseError"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface OrderItem {
    id: string
    name: string
    quantity: number
    unitPrice: number
  }
  
  interface AdditionalFee {
    name: string
    amount: number
  }
  
interface OrderData {
    deliveryTime: string;
    orderItems: OrderItem[];
    additionalFees: AdditionalFee[];
    totalAmount: number;
    customerName: string;
    description: string;
    address: string;
}

  
  



const initialFormData: OrderData = {
    customerName: '',
    description: '',
    address: '',
    deliveryTime: '',
    orderItems: [
      {
        id: crypto.randomUUID(),
        name: '',
        quantity: 1,
        unitPrice: 0
      }
    ],
    additionalFees: [
      {
        name: 'Delivery Fee',
        amount: 0
      }
    ],
    totalAmount: 0
}

const addOrderRequest = async (data: typeof initialFormData) => {
    try {
        validateForm(data)
      const response = await api.post('/orders', data)
      if(response.status === 200){
        return response.data
      }
      console.log(response)
      throw new Error("Error creating order")
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    } 
  }

export const useAddOrder = () => {
    const router = useRouter()
  const [formData, setFormData] = useState(initialFormData)
  const {mutateAsync: addOrder, isPending} = useMutation({
    mutationFn: async (data: typeof initialFormData) => {
        const validatedData = prepareOrderData(data)
        return addOrderRequest(validatedData as typeof initialFormData )
      },
    onSuccess: () => {
        toast.success('Order created successfully')
        router.push('/dashboard/orders')
        router.refresh()
    },
    onError: (error) => {
        console.error('Error creating order:', error)
        console.log(error)
        const {message,status} = handleError(error)
        toast.error(message,{
            duration:5000,
            position:'top-right'
        })
    }
  })

  const prepareOrderData = (data: typeof initialFormData) => {
    return {
      ...data,
      deliveryTime: new Date(data.deliveryTime).toISOString(),
      orderItems: data.orderItems.map(item => ({
        name: item.name,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
      additionalFees: data.additionalFees.map(fee => ({
        name: fee.name,
        amount: Number(fee.amount)
      })),
      totalAmount: calculateTotal()
    }
  }

  const addOrderItem = () => {
    setFormData(prev => ({
      ...prev,
      orderItems: [
        ...prev.orderItems,
        {
          id: crypto.randomUUID(),
          name: '',
          quantity: 1,
          unitPrice: 0
        }
      ]
    }))
  }

  const removeOrderItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      orderItems: prev.orderItems.filter(item => item.id !== id)
    }))
  }

  const updateOrderItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      orderItems: prev.orderItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const calculateSubtotal = () => {
    return formData.orderItems.reduce(
      (total, item) => total + (item.quantity * item.unitPrice),
      0
    )
  }

  const calculateAdditionalFees = () => {
    return formData.additionalFees.reduce(
      (total, fee) => total + Number(fee.amount),
      0
    )
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateAdditionalFees()
  }

  const updateFee = (index: number, field: keyof AdditionalFee, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      additionalFees: prev.additionalFees.map((fee, i) =>
        i === index ? { ...fee, [field]: value } : fee
      )
    }))
  }

  const addFee = () => {
    setFormData(prev => ({
      ...prev,
      additionalFees: [
        ...prev.additionalFees,
        {
          name: '',
          amount: 0
        }
      ]
    }))
  }

  const removeFee = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalFees: prev.additionalFees.filter((_, i) => i !== index)
    }))
  }

  return {
    formData,
    addOrder,
    addOrderItem,
    removeOrderItem,
    updateOrderItem,
    calculateSubtotal,
    calculateAdditionalFees,
    calculateTotal,
    updateFee,
    addFee,
    setFormData,
    isPending,
    removeFee
  }
}


const validateForm = (formData: typeof initialFormData) => {

    if (!formData.customerName.trim()) {
        throw new Error('Customer name is required')
    }

    if (!formData.address.trim()) {
        throw new Error('Delivery address is required')
    }

    if (!formData.deliveryTime) {
        throw new Error('Delivery time is required')
    }

    const hasInvalidItems = formData.orderItems.some((item: OrderItem)=>{
        if(!item.name.trim() || item.quantity < 1 || item.unitPrice < 0){
            return true
        }
        return false
    })

    if (hasInvalidItems) {
        throw new Error('All order items must be valid')
    }

    if (formData.orderItems.length === 0) {
        throw new Error('At least one item is required')
    }

  }


