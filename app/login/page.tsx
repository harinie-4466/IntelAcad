"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { BACKEND_URL } from "@/lib/api"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      })

      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast({ title: 'Login failed', description: body.message || res.statusText, variant: 'destructive' })
        return
      }

      const token = body.token
      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('isLoggedIn', 'true')
        toast({ title: 'Welcome back', description: 'You are now logged in' })

        const redirectPath = localStorage.getItem('redirectAfterLogin')
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin')
          router.push(redirectPath)
        } else {
          // Always route to the public landing page after login by default.
          // The landing page will guide the user to profile setup or navigator as needed.
          router.push('/landing')
        }
      } else {
        toast({ title: 'Login failed', description: 'No token received', variant: 'destructive' })
      }
    } catch (err: any) {
      toast({ title: 'Login error', description: err?.message || 'Unable to login', variant: 'destructive' })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-cyan-100 rounded-full">
              <GraduationCap className="h-8 w-8 text-cyan-800" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold" style={{ fontFamily: "var(--font-quantico)" }}>
            IntelAcad
          </CardTitle>
          <CardDescription>Where Streams Meet Strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-cyan-800 hover:bg-cyan-700">
              Login
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-cyan-800 hover:underline font-semibold">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
