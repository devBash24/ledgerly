import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkPermissions, ExtendedUser } from "@/lib/auth";
import { AccountType} from "@prisma/client";
import { handlePrismaError } from "@/lib/handlePrismaError";
export async function GET() {
  try {
    const auth = await checkPermissions("READ");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const accountId = auth.publicMetadata.organizationId || auth.publicMetadata.personalAccountId

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          {
            organizationId: accountId,
          },
          {
            personalAccountId: accountId,
          },
        ],
      },
      include: {
        orderItems: true,
        additionalFees: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error fetching orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await checkPermissions("WRITE");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const accountId = auth.publicMetadata.organizationId || auth.publicMetadata.personalAccountId

    const data = await request.json();
    const order = await createOrder(data, accountId, auth)
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    const {message,status} = handlePrismaError(error)
    return NextResponse.json(
      { error: message },
      { status: status }
    );
  }
}


const createOrder = async (data:any,  accountId:string, auth:ExtendedUser  ) => {
  try{
    const orderItems = data.orderItems.map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.unitPrice * item.quantity,
    }));
    if(auth.publicMetadata.accountType === AccountType.PERSONAL){
      const order = await prisma.order.create({
        data: {
          ...data,
          personalAccountId: accountId,
          createdBy: accountId,
          orderItems: {
            create: orderItems,
          },
          additionalFees: {
            create: data.additionalFees,
          },
        },
        include: {
          orderItems: true,
          additionalFees: true,
        },
      });
      return order
    }
    const order = await prisma.order.create({
      data: {
        ...data,
        organizationId: accountId,
        createdBy: auth.id,
        orderItems: {
          create: orderItems,
        },
        additionalFees: {
          create: data.additionalFees,
        },
      },
      include: {
        orderItems: true,
        additionalFees: true,
      },
    });
    return order
  }catch(error){
    throw error
  }

}
