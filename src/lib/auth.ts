import { clerkClient, currentUser, User } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { AccountType, Role } from '@prisma/client'
// import { setUserRole } from '@/app/api/onboarding/route'

export type PermissionCheck = 'READ' | 'WRITE' | 'DELETE' | 'UPDATE' | 'VIEW_FUNDING' | 'MANAGE_TEAM' | 'MANAGE_SETTINGS'


export interface ExtendedUser extends User {
  publicMetadata: {
    role: Role
    accountType: AccountType,
    isSuperAdmin: boolean,
    organizationId: string
    personalAccountId: string
    onboardingCompleted: boolean
  }
}

export async function checkPermissions(permission: PermissionCheck | PermissionCheck[]) {

  const user = await currentUser()
  if (!user) {
    return { error: "Unauthorized", status: 401 }
  }

  // await setUserRole(user.id, Role.MEMBER, "cm7v4w1ww0004h5kggegj6o6b", AccountType.ORGANIZATION)

  const accountType = user.publicMetadata.accountType
  if (accountType === "PERSONAL") {
    return user as ExtendedUser
  }

  const member = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
    include: {
      organization: true,
    },
  })

  if (!member) {
    return { error: "No organization found", status: 404 }
  }

  // Ensure permissions is treated as an array for easier checking
  const requiredPermissions = Array.isArray(permission) ? permission : [permission]

  // Check if the user has at least one of the required permissions
  const hasPermission = requiredPermissions.some((perm) => member.permissions.includes(perm))

  if (!hasPermission) {
    return { error: "Permission denied: You don't have permission to perform this action", status: 403 }
  }
  return user as ExtendedUser
}

