import { LayoutDashboard, ShoppingCart, DollarSign, BarChart, Settings, Users, UserCog } from "lucide-react"
import { Role, AccountType } from "@prisma/client"

interface NavItem {
  href: string;
  label: string;
  icon: any;
  showFor?: {
    roles?: Role[];
    accountTypes?: AccountType[];
  };
}

export const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  },
  {
    href: "/dashboard/orders",
    label: "Orders",
    icon: ShoppingCart
  },
  {
    href: "/dashboard/expenses",
    label: "Expenses",
    icon: DollarSign
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: BarChart
  },
  {
    href: "/dashboard/organization",
    label: "Organization",
    icon: Users,
    showFor: {
      roles: ["ADMIN"],
      accountTypes: ["ORGANIZATION"]
    }
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings
  }
]

interface UserAccess {
  role: Role;
  accountType: AccountType;
}

export function getFilteredNavItems(userAccess: UserAccess) {
  return navItems.filter(item => {
    if (!item.showFor) return true;
    
    const roleMatch = !item.showFor.roles || item.showFor.roles.includes(userAccess.role);
    const typeMatch = !item.showFor.accountTypes || item.showFor.accountTypes.includes(userAccess.accountType);
    
    return roleMatch && typeMatch;
  });
}