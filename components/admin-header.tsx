"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Settings, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/landing")
  }

  const handleSettings = () => {
    router.push("/admin/settings")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-cyan-600" />
            <span className="font-bold text-xl">IntelAcad Admin</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin" className="text-sm font-medium hover:text-cyan-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/approvals" className="text-sm font-medium hover:text-cyan-600 transition-colors">
              Approvals
            </Link>
            <Link href="/admin/users" className="text-sm font-medium hover:text-cyan-600 transition-colors">
              Users
            </Link>
            <Link href="/admin/analytics" className="text-sm font-medium hover:text-cyan-600 transition-colors">
              Analytics
            </Link>
            <Link href="/admin/notifications" className="text-sm font-medium hover:text-cyan-600 transition-colors">
              Notifications
            </Link>
            <Link href="/admin/content" className="text-sm font-medium hover:text-cyan-600 transition-colors">
              Content
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
