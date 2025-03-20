'use client'
import api from "@/lib/axios"
import { Expense } from "@/lib/types/expenses"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"


const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses')
      if (response.status !== 200) throw new Error('Failed to fetch expenses')
      const data = await response.data
      return data as Expense[]
    } catch (error) {
      console.error('Error fetching expenses:', error)
      throw error
    } 
  }

  const deleteExpenseById = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return
    try {
      const response = await api.post('/expenses/delete', {expenseId: id})
      if (response.status !== 200) throw new Error('Failed to delete expense')
      return response.data
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

export const useExpense = () => {
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [sortField, setSortField] = useState<'date' | 'amount'>('date')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
    const {data, isLoading, error} = useQuery({
        queryKey: ['expenses'],
        queryFn: () => fetchExpenses(),
        initialData: []
    })

    const {mutateAsync: deleteExpense, isPending: isDeleting} = useMutation({
        mutationFn: (id: string) => deleteExpenseById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['expenses']})
            toast.success('Expense deleted successfully')
        },
        onError: () => {
            toast.error('Failed to delete expense')
        }
   
    })

    const filteredAndSortedExpenses = data
      .filter(expense => {
        const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            expense.vendor.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        const aValue = sortField === 'date' ? new Date(a.date).getTime() : a.amount
        const bValue = sortField === 'date' ? new Date(b.date).getTime() : b.amount
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      })
    
    return {data: filteredAndSortedExpenses, isLoading, error, deleteExpense, isDeleting, searchQuery, setSearchQuery, categoryFilter, setCategoryFilter, sortField, setSortField, sortDirection, setSortDirection}
}

