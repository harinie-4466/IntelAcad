"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function CompanyLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/company/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-6">
              <Image src="/intelacad-logo.png" alt="IntelAcad" width={180} height={80} className="object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 text-center">Log in to your Company Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-cyan-800 focus:ring-cyan-800"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                required
              />
            </div>

            <div className="text-center">
              <Link href="/company/forgot-password" className="text-cyan-800 hover:text-cyan-900 font-medium text-sm">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-cyan-800 hover:bg-cyan-900 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Login
            </Button>

            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link href="/company/register" className="text-cyan-800 hover:text-cyan-900 font-medium">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
