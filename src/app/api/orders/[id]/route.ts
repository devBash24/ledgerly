import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkPermissions } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await checkPermissions('READ')
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    const accountId = auth.publicMetadata.organizationId || auth.publicMetadata.personalAccountId
    const order = await prisma.order.findUnique({
      where: { id: params.id, 
        OR: [
          { organizationId: accountId },
          { personalAccountId: accountId }
        ]
      },
      include: { orderItems: true, additionalFees: true }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {     
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
