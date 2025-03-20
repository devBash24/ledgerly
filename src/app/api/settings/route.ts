import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkPermissions } from '@/lib/auth'
import { AccountType } from '@prisma/client';
export async function GET() {
  try {
    const auth = await checkPermissions("READ");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const accountId = auth.publicMetadata.organizationId || auth.publicMetadata.personalAccountId
    const settings = await prisma.settings.findFirst({
      where: { 
        OR:[
          {organizationId:accountId},
          {personalAccountId:accountId}
        ]
      },
    });

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        businessName: '',
        businessEmail: '',
        currency: 'XCD',
        businessFunding: 0,
        notificationsEnabled: true,
        emailNotifications: true
      })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const auth = await checkPermissions("WRITE");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const body = await request.json();
    const accountId = auth.publicMetadata.organizationId || auth.publicMetadata.personalAccountId
    let settings;
    if(auth.publicMetadata.accountType === AccountType.PERSONAL){
      settings = await prisma.settings.update({
        where:{
          personalAccountId:accountId
        },
        data:{
          ...body
        }
      })
    }else if(auth.publicMetadata.accountType === AccountType.ORGANIZATION){
      settings = await prisma.settings.update({
        where:{
          organizationId:accountId
        },
        data:body
      })
    }else{
      throw new Error("Invalid account type")
    }
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
} 