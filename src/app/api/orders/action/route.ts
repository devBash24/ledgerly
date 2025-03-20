import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkPermissions, ExtendedUser } from '@/lib/auth'
import { AccountType } from '@prisma/client';

export async function POST(
  request: Request,
) {
  try {
    const auth = await checkPermissions(["DELETE","UPDATE"]);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const { orderId, action } = await request.json();
    const id = auth.publicMetadata.organizationId || auth.publicMetadata.personalAccountId

    if (action === "delete") {
        const order = await deleteOrder(orderId,id)
        return NextResponse.json(order)
    }
    if(action === "toggle"){
        const order = await toggleOrder(orderId,auth)
        return NextResponse.json(order)
    }


    return NextResponse.json({error: "Invalid action"},{status: 400})
  } catch (error) {
    console.error('Error toggling order status:', error)
    return NextResponse.json(
      { error: 'Failed to toggle order status' },
      { status: 500 }
    )
  }
}

const deleteOrder = async (orderId: string,id: string) => {
    try {

        return  await prisma.order.delete({
            where: { id: orderId, 
                OR: [
                    { organizationId: id },
                    { personalAccountId: id }
                ]
            },
        });
    } catch (error) {
        console.error('Error deleting order:', error)
        throw error
    }    
}


const toggleOrder = async (orderId: string,auth: ExtendedUser) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId, 
              OR: [
                { organizationId: auth.publicMetadata.organizationId },
                { personalAccountId: auth.publicMetadata.personalAccountId }
              ]
            },
          });
          if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
          }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId, 
              OR: [
                { organizationId: auth.publicMetadata.organizationId },
                { personalAccountId: auth.publicMetadata.personalAccountId }
              ]
            },
            data: { isCompleted: !order.isCompleted },
            include: { orderItems: true }
          })
      
          // Update business metrics when order is completed
          if (updatedOrder.isCompleted) {
            await updateBusinessMetrics(auth.publicMetadata.organizationId,auth.publicMetadata.accountType)
          }
      
        return updatedOrder
    } catch (error) {
        console.error('Error toggling order status:', error)
        throw error
    }
}




async function updateBusinessMetrics(id: string,accountType: AccountType) {
    const completedOrders = await prisma.order.findMany({
      where: { isCompleted: true, 
        OR: [
          { organizationId:id },
          { personalAccountId: id }
        ]
      },
      include: { orderItems: true }
    })
  
    const revenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  
    const expenses = await prisma.expense.aggregate({
      _sum: { amount: true }
    })
  
    const totalExpenses = expenses._sum.amount || 0
    const profit = revenue - totalExpenses
    if(accountType === AccountType.PERSONAL){
     return await prisma.businessMetrics.upsert({
        where: { id: 'default' },
        create: {
          id: 'default',
          personalAccountId: id,
          revenue,
          expenses: totalExpenses,
          profit
        },
        update: {
          revenue,
          expenses: totalExpenses,
          profit
        }
      })
      
    }
    
    return await prisma.businessMetrics.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        organizationId: id,
        revenue,
        expenses: totalExpenses,
        profit
      },
      update: {
        revenue,
        expenses: totalExpenses,
        profit
      }
    })
  } 
