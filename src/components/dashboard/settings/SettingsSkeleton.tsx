import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'

const SettingsSkeleton = () => {
  return (
    <div className="max-w-2xl space-y-8">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="h-6 w-24 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="space-y-2">
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="h-10 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default SettingsSkeleton