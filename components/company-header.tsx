"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function CompanyHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/company" className="flex items-center">
            <Image src="/intelacad-logo.png" alt="IntelAcad" width={140} height={60} className="object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href="/company"
              className="text-base font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/company/contact"
              className="text-base font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/company/register"
              className="text-base font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Register
            </Link>
            <Link
              href="/company/login"
              className="text-base font-medium text-slate-900 hover:text-slate-700 transition-colors"
            >
              Login
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link
                href="/company"
                className="text-base font-medium text-slate-700 hover:text-slate-900 transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/company/contact"
                className="text-base font-medium text-slate-700 hover:text-slate-900 transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/company/register"
                className="text-base font-medium text-slate-700 hover:text-slate-900 transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
              <Link
                href="/company/login"
                className="text-base font-medium text-slate-900 hover:text-slate-700 transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/company/dashboard"
                className="text-base font-medium text-slate-700 hover:text-slate-900 transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
