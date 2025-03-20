import React from 'react'
import { Card } from '../ui/card'
import { CardHeader } from '../ui/card'
import { CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
const OrderDetailsSkeleton = () => {
  return (
    <div className="min-h-screen p-8 space-y-8">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-[200px]" />
      <div className="flex gap-4">
        <Skeleton className="h-10 w-[120px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
    </div>
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[140px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[140px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
  )
}

export default OrderDetailsSkeleton