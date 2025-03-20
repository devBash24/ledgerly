import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkPermissions } from '@/lib/auth';
import { AccountType, JoinStatus, Permission, Role } from '@prisma/client';
import {  clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  const auth = await checkPermissions('READ');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const id = auth.publicMetadata.organizationId;

  try {
    if (!id) {
      return NextResponse.json({ error: 'Organization ID not found' }, { status: 400 });
    }

    const [members, requests] = await Promise.all([
      prisma.organizationMember.findMany({
        where: { organizationId: id },
        include: { 
          user: { select: { name: true, email: true } }, 
          organization: { select: { code: true } }
        }
      }),
      prisma.organizationJoinRequest.findMany({
        where: { 
          organizationId: id, 
          status: 'PENDING' 
        }
      })
    ]);

    const organizationCode = members[0]?.organization?.code;
    if (!organizationCode) {
      return NextResponse.json({ error: 'Organization code not found' }, { status: 400 });
    }

    return NextResponse.json({ 
      members, 
      organizationCode, 
      requests,
    });
  } catch (error) {
    console.error('Organization fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch organization data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await checkPermissions('MANAGE_TEAM');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { action, ...data } = await request.json();
    const organizationId = auth.publicMetadata.organizationId;

    switch (action) {
      case 'UPDATE_PERMISSION': {
        const { memberId, permission, value } = data;
        
        // Check if user can modify permissions
        const targetMember = await prisma.organizationMember.findUnique({
          where: { id: memberId }
        });

        if (!targetMember) {
          return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        if (targetMember.role === 'ADMIN') {
          return NextResponse.json({ error: 'Cannot modify admin permissions' }, { status: 403 });
        }

        // Update permissions
        const updatedMember = await prisma.organizationMember.update({
          where: { id: memberId },
          data: {
            permissions: value
              ? { push: permission as Permission }
              : { set: targetMember.permissions.filter(p => p !== permission) }
          },
          include: {
            user: { select: { name: true, email: true } }
          }
        });

        return NextResponse.json(updatedMember);
      }

      case 'REMOVE_MEMBER': {
        const { memberId } = data;
        
        // Check if target is not an admin
        const targetMember = await prisma.organizationMember.findUnique({
          where: { id: memberId }
        });

        if (!targetMember) {
          return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        if (targetMember.role === 'ADMIN') {
          return NextResponse.json({ error: 'Cannot remove an admin' }, { status: 403 });
        }

        if (targetMember.userId === auth.id) {
          return NextResponse.json({ error: 'Cannot remove yourself' }, { status: 403 });
        }

        await prisma.organizationMember.delete({
          where: { id: memberId }
        });

        return NextResponse.json({ success: true });
      }

      case 'HANDLE_REQUEST': {
        const { requestId, status } = data;
        
        const request = await prisma.organizationJoinRequest.findUnique({
          where: { id: requestId }
        });

        if (!request) {
          return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        const updatedRequest = await prisma.organizationJoinRequest.update({
          where: { id: requestId },
          data: { status }
        });
        
        if (status === 'APPROVED') {
          await prisma.$transaction([
            // Update request status
            prisma.organizationJoinRequest.update({
              where: { id: requestId },
              data: { status: JoinStatus.APPROVED }
            }),
    
            // Create member record
            prisma.organizationMember.create({
              data: {
                organizationId,
                userId: request.userId,
                role: Role.MEMBER,
                permissions: [Permission.READ]
              }
            }),
    
            // Update user
            prisma.user.update({
              where: { id: request.userId },
              data: { isOnboarded: true }
            })
          ]);
          await setUserSession(request.userId,organizationId,AccountType.ORGANIZATION,Role.MEMBER)
        }
        
        return NextResponse.json(updatedRequest);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Organization update error:', error);
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
  }
}

const setUserSession = async (userId:string,accountId:string,accountType:AccountType,role?:Role)=>{
 
  

  const client = await clerkClient()
  try {
      if(accountType === AccountType.PERSONAL){
          throw new Error("Personal account not supported")
      }
      else if(accountType === AccountType.ORGANIZATION){
          const res = await client.users.updateUser(userId, {
              publicMetadata: {
                  role: role,
                  accountType: accountType,
                  isSuperAdmin: false,
                  organizationId: accountId,
                  onboardingCompleted: true
              },
            })
            return { message: res.publicMetadata }
      }

  } catch (err) {
    return { error: 'There was an error updating the user metadata.' }
  }
 
}