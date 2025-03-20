'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Legend, Pie, Tooltip } from 'recharts'
import { PieChart } from 'recharts'
import { Cell } from 'recharts'
import React from 'react'
import { ResponsiveContainer } from 'recharts'
import { useDashboard } from '@/context/dashboardContext'

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6']
const ExpensesCategoryChart = () => {
    const {data} = useDashboard()
  return (
    <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.expensesByCategory}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {data.expensesByCategory.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
  )
}

export default ExpensesCategoryChart