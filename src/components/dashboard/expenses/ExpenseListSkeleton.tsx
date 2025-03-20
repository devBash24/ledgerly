import { CardContent } from '@/components/ui/card'
import { Card } from '@/components/ui/card'
import React from 'react'

const ExpenseListSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ExpenseListSkeleton