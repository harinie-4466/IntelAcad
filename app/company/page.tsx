"use client"

import { CompanyHeader } from "@/components/company-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Building2, Users, TrendingUp, Target } from "lucide-react"

export default function CompanyDashboard() {
  return (
    <div className="min-h-screen">
      <CompanyHeader />

      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-cyan-800 leading-tight">
              Where Streams Meet Strategies
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Empowering companies to connect with talented interns and build the future workforce
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-8">
            <Card className="p-6 text-left space-y-3 border-cyan-100 hover:border-cyan-200 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-cyan-50 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-cyan-800" />
              </div>
              <h3 className="text-lg font-semibold text-cyan-800">Post Internships</h3>
              <p className="text-slate-600 text-sm">
                Create and manage internship opportunities with detailed job descriptions, requirements, and application
                tracking.
              </p>
            </Card>

            <Card className="p-6 text-left space-y-3 border-cyan-100 hover:border-cyan-200 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-cyan-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-800" />
              </div>
              <h3 className="text-lg font-semibold text-cyan-800">Find Top Talent</h3>
              <p className="text-slate-600 text-sm">
                Access a pool of qualified students and recent graduates actively seeking internship opportunities.
              </p>
            </Card>

            <Card className="p-6 text-left space-y-3 border-cyan-100 hover:border-cyan-200 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-cyan-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-cyan-800" />
              </div>
              <h3 className="text-lg font-semibold text-cyan-800">Track Applications</h3>
              <p className="text-slate-600 text-sm">
                Monitor and manage all applications in one place with an intuitive dashboard and applicant management
                system.
              </p>
            </Card>

            <Card className="p-6 text-left space-y-3 border-cyan-100 hover:border-cyan-200 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-cyan-50 flex items-center justify-center">
                <Target className="w-6 h-6 text-cyan-800" />
              </div>
              <h3 className="text-lg font-semibold text-cyan-800">Build Your Team</h3>
              <p className="text-slate-600 text-sm">
                Streamline your recruitment process and build a pipeline of future talent for your organization.
              </p>
            </Card>
          </div>

          <div className="flex justify-center pt-8">
            <Link href="/company/register">
              <Button
                size="lg"
                className="bg-cyan-800 hover:bg-cyan-700 text-white px-12 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
