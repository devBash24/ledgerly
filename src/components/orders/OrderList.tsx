'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { useOrders } from '@/hooks/useOrders'
import OrderListSkeleton from './OrderListSkeleton'
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
}

export function OrderList() {
  const {orders, isLoading, searchTerm, statusFilter, handleSort, setSearchTerm, setStatusFilter, orderAction} = useOrders()

  if (isLoading) {
    return <OrderListSkeleton />
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Orders</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[200px]"
                />
                <Select
                  value={statusFilter}
                  onValueChange={(value: 'all' | 'completed' | 'pending') => 
                    setStatusFilter(value)
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-4 px-4 py-2 bg-muted rounded-lg text-sm font-medium">
              <button
                className="flex items-center gap-1"
                onClick={() => handleSort('customerName')}
              >
                Customer
                <ArrowUpDown className="w-4 h-4" />
              </button>
              <button
                className="flex items-center gap-1"
                onClick={() => handleSort('totalAmount')}
              >
                Amount
                <ArrowUpDown className="w-4 h-4" />
              </button>
              <button
                className="flex items-center gap-1"
                onClick={() => handleSort('deliveryTime')}
              >
                Delivery
                <ArrowUpDown className="w-4 h-4" />
              </button>
              <div>Items</div>
              <div>Status</div>
              <div></div>
            </div>

            <AnimatePresence mode="popLayout">
              { orders.map((order) => (
                <motion.div
                  key={order.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-6 gap-4 items-center">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.address}
                          </p>
                        </div>
                        <div className="text-primary font-bold">
                          ${order.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-sm">
                          {format(new Date(order.deliveryTime), 'MMM dd, yyyy p')}
                        </div>
                        <div>
                          <p className="text-sm">
                            {order.orderItems.length} items
                          </p>
                        </div>
                        <div>
                          <Badge
                            variant={order.isCompleted ? "secondary" : "outline"}
                            className="gap-1"
                          >
                            {order.isCompleted ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            {order.isCompleted ? "Completed" : "Pending"}
                          </Badge>
                        </div>
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => orderAction({action: 'toggle', orderId: order.id})}
                              >
                                {order.isCompleted ? "Mark as Pending" : "Mark as Completed"}
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/orders/${order.id}`}>View Details</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => orderAction({action: 'delete', orderId: order.id})}
                              >
                                Delete Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

