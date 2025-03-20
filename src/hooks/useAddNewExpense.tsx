import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";

export const EXPENSE_CATEGORIES = [
    { value: 'supplies', label: 'Supplies' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'rent', label: 'Rent' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'payroll', label: 'Payroll' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'travel', label: 'Travel' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'software', label: 'Software' },
    { value: 'other', label: 'Other' }
  ]

const newExpenseInitialState: Expense = {
    description: '',
    category: '',
    vendor: '',
    date: new Date(),
    items: []
}

interface ExpenseItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }

  interface Expense {
    description: string;
    category: string;
    vendor: string;
    date: Date;
    items: ExpenseItem[];
  }

  const calculateTotal = (items: ExpenseItem[]) => {
    return items.reduce(
      (total, item) => total + (item.quantity * item.unitPrice),
      0
    )
  }

  const createExpense = async (expense: Expense) => {
    try {
      const response = await api.post('/expenses',{
            description: expense.description,
            amount: calculateTotal(expense.items),
            category: expense.category,
            vendor: expense.vendor,
            date: expense.date.toISOString(),
            items: expense.items.map(item => ({
              description: item.description,
              quantity: Number(item.quantity),
              unitPrice: Number(item.unitPrice),
              totalPrice: item.quantity * item.unitPrice
            }))
      })
      if(response.status !== 200){
        throw new Error('Failed to create expense')
      }
      return response.data
    } catch (error) {
      console.error('Error creating expense:', error)
      throw error
    } 
  }

  const validateForm = (formData: Expense) => {
    try{
    if (!formData.description.trim()) {
      throw new Error('Description is required')
    }

    if (!formData.category) {
      throw new Error('Category is required')
    }

    if (!formData.vendor.trim()) {
      throw new Error('Vendor is required')
    }

    if (!formData.date) {
      throw new Error('Date is required')
    }

    const hasInvalidItems = formData.items.some(
      item => !item.description.trim() || item.quantity < 1 || item.unitPrice < 0
    )

    if (hasInvalidItems) {
      throw new Error('All items must be valid')
    }

    if (formData.items.length === 0) {
      throw new Error('At least one item is required')
    }

    }
    catch(error){
        console.error('Error validating form:', error)
        throw error
    }
 
  }
  

export const useAddNewExpense = () => {
    const router = useRouter()
    const [formData, setFormData] = useState(newExpenseInitialState)
    const { mutateAsync, isPending: isCreating } = useMutation({
        onMutate: (data: Expense) => {
            validateForm(data)
        },
        mutationFn: createExpense,
        onSuccess: () => {
            toast.success('Expense created successfully')
            router.push('/dashboard/expenses')
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : 'Failed to create expense')
        }
    })

      const addItem = () => {
        setFormData(prev => ({
          ...prev,
          items: [
            ...prev.items,
            {
              id: crypto.randomUUID(),
              description: '',
              quantity: 1,
              unitPrice: 0
            }
          ]
        }))
      }
    
      const removeItem = (id: string) => {
        setFormData(prev => ({
          ...prev,
          items: prev.items.filter(item => item.id !== id)
        }))
      }
    
      const updateItem = (id: string, field: keyof ExpenseItem, value: string | number) => {
        setFormData(prev => ({
          ...prev,
          items: prev.items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
          )
        }))
      }

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await mutateAsync(formData)
      }

      return {
        formData,
        addItem,
        removeItem,
        updateItem,
        handleSubmit,
        isCreating,
        setFormData
      }
}

