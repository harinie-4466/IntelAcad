"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Briefcase, Users, Menu, X, Home, PlusCircle, FileText, LogOut } from "lucide-react"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface Internship {
  id: string
  companyName: string
  internshipTitle: string
  companyLocation: string
  city: string
  duration: string
  durationUnit: string
  positions: string
  stipendType: string
  skills: string[]
  createdAt: string
}

export default function Analytics() {
  const [internships, setInternships] = useState<Internship[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("internships")
      if (stored) {
        const parsed = JSON.parse(stored)
        setInternships(Array.isArray(parsed) ? parsed : [])
      }
    } catch (error) {
      console.error("Error loading internships:", error)
      setInternships([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateMetrics = (internshipId: string) => {
    const seed = internshipId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const totalRegistrations = (seed % 80) + 20
    const positions = (seed % 15) + 5
    const percentage = Math.min(Math.round((totalRegistrations / (positions * 3)) * 100), 100)

    return {
      totalRegistrations,
      positions,
      percentage,
      applicantsPerPosition: (totalRegistrations / positions).toFixed(1),
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 bg-slate-50">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex w-64 bg-cyan-800 text-white flex-col">
          <div className="p-6 border-b border-cyan-700">
            <Link href="/company" className="flex items-center">
              <Image
                src="/IntelAcad.png"
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
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
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
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-700 transition-colors"
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
            <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
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
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors text-sm"
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
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-cyan-700 transition-colors text-sm"
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
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/company/dashboard">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-cyan-800 text-cyan-800 hover:bg-cyan-50 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Registration Analytics</h1>
                <p className="text-gray-600 mt-1">Track student registrations for each internship</p>
              </div>
            </div>

            {internships.length === 0 ? (
              <Card className="shadow-lg">
                <CardContent className="p-12 text-center">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">No Internships Posted Yet</h2>
                  <p className="text-gray-600 mb-6">Create your first internship to start tracking analytics</p>
                  <Link href="/company/create">
                    <Button className="bg-cyan-800 hover:bg-cyan-900 text-white">Post Internship</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {internships.map((internship) => {
                  const metrics = generateMetrics(internship.id)
                  const chartData = [
                    { name: "Registrations", value: metrics.totalRegistrations, fill: "#8b5cf6" },
                    { name: "Positions", value: Number.parseInt(internship.positions), fill: "#0e7490" },
                    { name: "Target", value: Number.parseInt(internship.positions) * 3, fill: "#e2e8f0" },
                  ]

                  return (
                    <Card
                      key={internship.id}
                      className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <CardContent className="p-4">
                        <h3 className="text-base font-bold text-center mb-1 line-clamp-2 min-h-[2.5rem] text-gray-900">
                          {internship.internshipTitle}
                        </h3>
                        <p className="text-xs text-gray-600 text-center mb-3">{internship.companyName}</p>

                        <div className="h-32 mb-3">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} />
                              <YAxis tick={{ fontSize: 10 }} tickLine={false} />
                              <Tooltip
                                contentStyle={{
                                  fontSize: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #e2e8f0",
                                }}
                              />
                              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="space-y-2 text-center">
                          <div className="bg-purple-50 rounded-lg p-2">
                            <p className="text-xs text-gray-600">Total Registrations</p>
                            <p className="text-xl font-bold text-purple-600">{metrics.totalRegistrations}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-cyan-50 rounded-lg p-2">
                              <p className="text-xs text-gray-600">Positions</p>
                              <p className="text-base font-semibold text-cyan-800">{internship.positions}</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-2">
                              <p className="text-xs text-gray-600">Per Position</p>
                              <p className="text-base font-semibold text-gray-900">{metrics.applicantsPerPosition}</p>
                            </div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2">
                            <p className="text-xs text-gray-600">Fill Rate</p>
                            <p className="text-base font-semibold text-green-600">{metrics.percentage}%</p>
                          </div>
                        </div>

                        <Link href={`/company/internships/${internship.id}`} className="block mt-3">
                          <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white text-sm py-2">
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
