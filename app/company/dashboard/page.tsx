"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Home,
  Briefcase,
  PlusCircle,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  Calendar,
  TrendingUp,
  ArrowLeft,
} from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Footer } from "@/components/footer"

const applicationsData = [
  { month: "Jan", value: 1 },
  { month: "Feb", value: 5 },
  { month: "Mar", value: 8 },
  { month: "Apr", value: 12 },
  { month: "May", value: 18 },
  { month: "Jun", value: 25 },
  { month: "Jul", value: 32 },
  { month: "Aug", value: 38 },
  { month: "Sep", value: 42 },
  { month: "Oct", value: 48 },
  { month: "Nov", value: 50 },
]

const internshipTypeData = [
  { name: "Full-time", value: 50, color: "#0891b2" },
  { name: "Part-time", value: 20, color: "#06b6d4" },
  { name: "Remote", value: 30, color: "#22d3ee" },
]

const quarterlyGrowthData = [
  { quarter: "Q1", value: 45 },
  { quarter: "Q2", value: 52 },
  { quarter: "Q3", value: 68 },
  { quarter: "Q4", value: 78 },
  { quarter: "Q5", value: 62 },
]

const recentActivity = [
  { id: 1, text: 'New applicant for "Software Engineer" posted', time: "2 hours ago" },
  { id: 2, text: 'New applicant for "Software Engineer"', time: "5 hours ago" },
  { id: 3, text: "Successful Hires", time: "1 day ago", count: 8 },
  { id: 4, text: 'New applicant for "Software Engineer" posted', time: "2 days ago" },
]

export default function CompanyDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 bg-slate-50">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex w-64 bg-cyan-800 text-white flex-col">
          <div className="p-6 border-b border-cyan-700">
            <Link href="/company" className="flex items-center">
              <Image
                src="/Intelacad.png"
                alt="IntelAcad"
                width={140}
                height={40}
                className="object-contain"
              />
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/company/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Overview</span>
            </Link>
            <Link
              href="/company/internships"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <Briefcase className="w-5 h-5" />
              <span className="font-medium">Internships</span>
            </Link>
            <Link
              href="/company/create"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="font-medium">Post Internship</span>
            </Link>
            <Link
              href="/company/applicants"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Applicants</span>
            </Link>
            <Link
              href="/company/analytics"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-cyan-700">
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors w-full text-left">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-cyan-800 text-white rounded-lg shadow-lg"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Sidebar - Mobile */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)} />

            {/* Compact Sidebar */}
            <aside className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-cyan-800 text-white flex flex-col shadow-2xl">
              <div className="p-4 border-b border-cyan-700">
                <Link href="/company" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                  <Image
                    src="/intelacad-logo.png"
                    alt="IntelAcad"
                    width={120}
                    height={32}
                    className="object-contain brightness-0 invert"
                  />
                </Link>
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                <Link
                  href="/company/dashboard"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-cyan-700 transition-colors text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">Overview</span>
                </Link>
                <Link
                  href="/company/internships"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="font-medium">Internships</span>
                </Link>
                <Link
                  href="/company/create"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="font-medium">Post Internship</span>
                </Link>
                <Link
                  href="/company/applicants"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Applicants</span>
                </Link>
                <Link
                  href="/company/analytics"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">Analytics</span>
                </Link>
              </nav>

              <div className="p-3 border-t border-cyan-700">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors w-full text-left text-sm">
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Company Dashboard</h1>
              <Link href="/landing">
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-800 hover:bg-cyan-900 text-white rounded-lg transition-colors shadow-sm">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Landing</span>
                  <span className="sm:hidden">Landing</span>
                </button>
              </Link>
            </div>

            {/* Company Overview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Company Overview Card */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-700">Company Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-slate-600">
                    <span className="font-medium">Founded:</span> 2010
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium">Headquarters:</span> New York, USA
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium">Employees:</span> 280+
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium">Industry:</span> Technology & Software
                  </p>
                </CardContent>
              </Card>

              {/* Key Metrics Card */}
              <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-700">Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    {/* Revenue Goal */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24 mb-2">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#0e7490"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.85)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-cyan-800">85%</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 text-center">Revenue Goal</p>
                    </div>

                    {/* Project Completion */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24 mb-2">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#10b981"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.92)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-green-600">92%</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 text-center">Project Completion</p>
                    </div>

                    {/* Customer Satisfaction */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24 mb-2">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#a78bfa"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.78)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-purple-500">78%</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 text-center">Customer Satisfaction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quarterly Growth Card */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-700">Quarterly Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={quarterlyGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="quarter" stroke="#64748b" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0e7490" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Upcoming Events Card */}
              <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-700">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-cyan-800" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Product Launch - Oct 3</p>
                      <p className="text-sm text-slate-600">Team Training</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-cyan-800" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Q4 Review - Oct 15</p>
                      <p className="text-sm text-slate-600">Performance Analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
