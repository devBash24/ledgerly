'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAddOrder } from '@/hooks/useAddOrder'

export function NewOrderForm() {
  const {formData, addOrder, addOrderItem, removeOrderItem, updateOrderItem, calculateSubtotal, calculateAdditionalFees, calculateTotal, updateFee, addFee, setFormData, isPending, removeFee} = useAddOrder()
  const router = useRouter()
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addOrder(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                customerName: e.target.value
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                address: e.target.value
              }))}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deliveryTime">Delivery Time</Label>
              <Input
                id="deliveryTime"
                type="datetime-local"
                value={formData.deliveryTime}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  deliveryTime: e.target.value
                }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Notes (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Order Items</CardTitle>
          <Button type="button" onClick={addOrderItem} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">

          <AnimatePresence mode="popLayout">
            {formData.orderItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-4 p-4 border rounded-lg md:grid-cols-[1fr,100px,140px,auto]"
              >
                <div>
                  <Label htmlFor={`item-name-${item.id}`}>Item Name</Label>
                  <Input
                    id={`item-name-${item.id}`}
                    value={item.name}
                    onChange={(e) => updateOrderItem(item.id, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`item-quantity-${item.id}`}>Quantity</Label>
                  <Input
                    id={`item-quantity-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateOrderItem(item.id, 'quantity', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor={`item-price-${item.id}`}>Unit Price</Label>
                  <Input
                    id={`item-price-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateOrderItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removeOrderItem(item.id)}
                    disabled={formData.orderItems.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-end pt-4 border-t">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">
                ${calculateSubtotal().toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Additional Fees</CardTitle>
          <Button type="button" onClick={addFee} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Fee
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence mode="popLayout">
            {formData.additionalFees.map((fee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-4 p-4 border rounded-lg md:grid-cols-[1fr,140px,auto]"
              >
                <div>
                  <Label htmlFor={`fee-name-${index}`}>Fee Name</Label>
                  <Input
                    id={`fee-name-${index}`}
                    value={fee.name}
                    onChange={(e) => updateFee(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`fee-amount-${index}`}>Amount</Label>
                  <Input
                    id={`fee-amount-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={fee.amount}
                    onChange={(e) => updateFee(index, 'amount', e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removeFee(index)}
                    disabled={index === 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Additional Fees</span>
              <span>${calculateAdditionalFees().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/orders')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create Order
        </Button>
      </div>
    </form>
  )
} 