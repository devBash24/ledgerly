import { JoinStatus, Permission, Role } from "@prisma/client";

export interface OrganizationMember {
  id: string;
  user:{
    name: string;
    email: string;
  }
  permissions: Permission[]
  role: Role
  status: 'ACTIVE' | 'PENDING';
  joinedAt: string;
}

export interface JoinRequest {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  status: JoinStatus
}


interface PermissionConfig {
  key: Permission;
  label: string;
  description: string;
}

export const PERMISSIONS: PermissionConfig[] = [
  {
    key: Permission.READ,
    label: 'View Access',
    description: 'Can view orders, expenses, and basic information'
  },
  {
    key: Permission.WRITE,
    label: 'Create Records',
    description: 'Can create new orders and expenses'
  },
  {
    key: Permission.UPDATE,
    label: 'Update Records',
    description: 'Can modify existing orders and expenses'
  },
  {
    key: Permission.DELETE,
    label: 'Delete Records',
    description: 'Can delete orders and expenses'
  },
  {
    key: Permission.VIEW_FUNDING,
    label: 'View Funding',
    description: 'Can view business funding and financial details'
  },
  {
    key: Permission.MANAGE_TEAM,
    label: 'Manage Team',
    description: 'Can manage team members and their permissions'
  },
  {
    key: Permission.MANAGE_SETTINGS,
    label: 'Manage Settings',
    description: 'Can modify organization settings'
  }
];

