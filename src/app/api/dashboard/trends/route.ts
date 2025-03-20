import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { subDays } from 'date-fns'
import { checkPermissions } from '@/lib/auth'

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const auth = await checkPermissions('READ')
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    const organizationId = auth.publicMetadata.organizationId as string
    const thirtyDaysAgo = subDays(new Date(), 30)
    const sixtyDaysAgo = subDays(new Date(), 60)

    // Get current period metrics
    const [currentRevenue, currentOrders, currentCustomers] = await Promise.all([
      // Revenue
      prisma.order.aggregate({
        where: {
          OR: [
            {
              organizationId: organizationId,
            },
            {
              personalAccountId: organizationId,
            }
          ],
          createdAt: {
            gte: thirtyDaysAgo
          },
          isCompleted: true
        },
        _sum: {
          totalAmount: true
        }
      }),

      // Orders
      prisma.order.count({
        where: {
          OR: [
            {
              organizationId: organizationId,
            },
            {
              personalAccountId: organizationId,
            }
          ],
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      }),

      // Customers
      prisma.order.groupBy({
        by: ['customerName'],
        where: {
          OR: [
            { organizationId },
            { personalAccountId: organizationId }
          ],
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      })
    ])

    // Get previous period metrics
    const [previousRevenue, previousOrders, previousCustomers] = await Promise.all([
      // Revenue
      prisma.order.aggregate({
        where: {
          OR: [
            {
              organizationId: organizationId,
            },
            {
              personalAccountId: organizationId,
            }
          ],
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          },
          isCompleted: true
        },
        _sum: {
          totalAmount: true
        }
      }),

      // Orders
      prisma.order.count({
        where: {
          OR: [
            {
              organizationId: organizationId,
            },
            {
              personalAccountId: organizationId,
            }
          ],
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          }
        }
      }),

      // Customers
      prisma.order.groupBy({
        by: ['customerName'],
        where: {
          OR: [
            { organizationId },
            { personalAccountId: organizationId }
          ],
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          }
        }
      })
    ])

    // Calculate trends
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return 100
      return ((current - previous) / previous) * 100
    }

    const trends = {
      revenue: calculateTrend(
        currentRevenue._sum.totalAmount || 0,
        previousRevenue._sum.totalAmount || 0
      ),
      orders: calculateTrend(currentOrders, previousOrders),
      customers: calculateTrend(currentCustomers.length, previousCustomers.length)
    }

    return NextResponse.json(trends)
  } catch (error) {
    console.error('Dashboard Trends API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trend data' },
      { status: 500 }
    )
  }
} 