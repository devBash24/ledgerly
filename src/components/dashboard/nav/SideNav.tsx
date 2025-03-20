import { MainNav } from "./MainNav"
import { UserNav } from "./UserNav"

export function SideNav() {
  return (
    <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 border-r bg-background">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex h-16 items-center gap-2 px-4 border-b">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600" />
          <h1 className="font-bold">Ledgerly VC</h1>
        </div>
        <MainNav />
        <div className="p-4 border-t">
          <UserNav />
        </div>
      </div>
    </div>
  )
} 