import { checkPermissions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(request: Request) {

    try{
        const auth = await checkPermissions("DELETE");
        if ("error" in auth) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }
        const id = auth.publicMetadata.organizationId || auth.publicMetadata.personalAccountId


        const { expenseId } = await request.json();
        await prisma.expense.delete({
            where: {
                id: expenseId,
                OR: [
                    { organizationId: id },
                    { personalAccountId: id }
                ]
            }
        })

        return NextResponse.json({ message: "Expense deleted successfully" }, { status: 200 });

    }catch(error){
        console.error("Error deleting expense", error);
        return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
    }
 
}

