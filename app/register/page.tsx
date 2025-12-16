"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { GraduationCap, Building2, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { BACKEND_URL } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userType, setUserType] = useState<"student" | "company" | "admin">("student")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Student specific
    rollNumber: "",
    branch: "",
    year: "",
    // Company specific
    companyName: "",
    designation: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }

      // Debug logging
      console.log('Registration payload:', payload)
      console.log('Form data:', formData)

      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const body = await res.json().catch(() => ({}))
      
      // Debug logging
      console.log('Registration response:', { status: res.status, body })
      
      if (!res.ok) {
        toast({ title: 'Registration failed', description: body.message || res.statusText, variant: 'destructive' })
        return
      }

      // Auto-login after successful registration
      const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      })
      const loginBody = await loginRes.json().catch(() => ({}))
      if (loginRes.ok && loginBody.token) {
        const token = loginBody.token
        localStorage.setItem('token', token)
        localStorage.setItem('isLoggedIn', 'true')
        toast({ title: 'Account created', description: 'You are now logged in' })

        if (userType === 'student') {
          // Persist initial profile server-side
          const profilePayload = {
            rollNumber: formData.rollNumber,
            branch: formData.branch,
            year: formData.year,
            profileCompleted: false,
          }

          try {
            await fetch(`${BACKEND_URL}/api/profile`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify(profilePayload),
            })
          } catch (err) {
            // ignore server errors for now; the user can fill setup later
          }

          // Redirect to the public landing page; landing decides next step
          router.push('/landing')
        } else if (userType === 'company') router.push('/company')
        else router.push('/admin')
      } else {
        toast({ title: 'Registration succeeded', description: 'Please login to continue' })
        router.push('/login')
      }
    } catch (err: any) {
      toast({ title: 'Registration error', description: err?.message || 'Unable to register', variant: 'destructive' })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-purple-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <svg
              width="48"
              height="40"
              viewBox="0 0 24 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-cyan-800"
            >
              <path d="M3 8L12 4L21 8L12 12L3 8Z" stroke="currentColor" strokeWidth="2" fill="currentColor" />
              <path d="M4 9L4 14" stroke="currentColor" strokeWidth="2" />
              <circle cx="4" cy="15" r="1" fill="currentColor" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold" style={{ fontFamily: "var(--font-quantico)" }}>
            Create Your Account
          </CardTitle>
          <CardDescription>Join IntelAcad and start your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-3">
              <Label>I am a</Label>
              <RadioGroup
                value={userType}
                onValueChange={(value: any) => setUserType(value)}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="student" id="student" className="peer sr-only" />
                  <Label
                    htmlFor="student"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-cyan-800 [&:has([data-state=checked])]:border-cyan-800 cursor-pointer"
                  >
                    <GraduationCap className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">Student</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="company" id="company" className="peer sr-only" />
                  <Label
                    htmlFor="company"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600 cursor-pointer"
                  >
                    <Building2 className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">Company</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
                  <Label
                    htmlFor="admin"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-800 [&:has([data-state=checked])]:border-gray-800 cursor-pointer"
                  >
                    <Shield className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">Admin</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{userType === "company" ? "Contact Name" : "Full Name"}</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
            </div>

            {/* Student Specific Fields */}
            {userType === "student" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    name="rollNumber"
                    placeholder="e.g., 21CS001"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    name="branch"
                    placeholder="e.g., CSE"
                    value={formData.branch}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    placeholder="e.g., 3"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Company Specific Fields */}
            {userType === "company" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Your company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Your Designation</Label>
                  <Input
                    id="designation"
                    name="designation"
                    placeholder="e.g., HR Manager"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full ${
                userType === "student"
                  ? "bg-cyan-800 hover:bg-cyan-700"
                  : userType === "company"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-800 hover:underline font-semibold">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
