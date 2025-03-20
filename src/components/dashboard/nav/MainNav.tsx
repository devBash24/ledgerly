// src/components/dashboard/nav/MainNav.tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { getFilteredNavItems } from "./navItems"
import { useUser } from "@clerk/nextjs"
import { AccountType } from "@prisma/client"
import { Role } from "@prisma/client"

export function MainNav() {
  const pathname = usePathname()
  const { user } = useUser()
  
  const userAccess = {
    role: user?.publicMetadata.role as Role || "MEMBER",
    accountType: user?.publicMetadata.accountType as AccountType || "PERSONAL"
  }

  const filteredNavItems = getFilteredNavItems(userAccess)

  return (
    <nav className="flex-1 px-2 py-4 space-y-1">
      {filteredNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md",
            pathname === item.href
              ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
              : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  )
}