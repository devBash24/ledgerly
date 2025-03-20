import { checkPermissions, ExtendedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AccountType } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET() {
  const auth = await checkPermissions('READ')
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const id = auth.publicMetadata.organizationId || auth.publicMetadata.personalAccountId

  const expenses = await prisma.expense.findMany({
    where: {
      OR: [
        { organizationId: id },
        { personalAccountId: id }
      ]
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return NextResponse.json(expenses)
}

export async function POST(request: Request) {
  const auth = await checkPermissions('WRITE')
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const data = await request.json()
  const pId =  auth.publicMetadata.personalAccountId
  const oId = auth.publicMetadata.organizationId
  const expense = await prisma.expense.create({
    data: {
      ...data,
      organizationId: oId,
      personalAccountId: pId,
      createdBy: auth.fullName,
      items: {
        create: data.items
      }
    },
    include: {
      items: true,
    }
  })
  await updateBusinessMetrics(auth)

  return NextResponse.json(expense)
}

async function updateBusinessMetrics(auth: ExtendedUser) {
  const id = auth.publicMetadata.organizationId || auth.publicMetadata.personalAccountId
  const expenses = await prisma.expense.aggregate({
    _sum: { amount: true }
  })

  const completedOrders = await prisma.order.findMany({
    where: { isCompleted: true }
  })

  const revenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalExpenses = expenses._sum.amount || 0
  const profit = revenue - totalExpenses

  await prisma.businessMetrics.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      revenue,
      expenses: totalExpenses,
      profit,
      organizationId: auth.publicMetadata.accountType !==AccountType.PERSONAL ? id : null,
      personalAccountId: auth.publicMetadata.accountType ===AccountType.PERSONAL ? id : null
    },
    update: {
      revenue,
      expenses: totalExpenses,
      profit
    }
  })
} 