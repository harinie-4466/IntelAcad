"use client"

import { useState, useEffect } from "react"
import { StudentHeader } from "@/components/student-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Download, FileText, Calendar, Edit, Trash2, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

interface CompletedAssessment {
  id: string
  title: string
  platform: string
  platformLogo: string
  completedDate: string
  score?: string
  notes?: string
  difficulty: "Easy" | "Medium" | "Hard"
  domain: string
  topics: string[]
}

export default function CompletedAssessments() {
  const [searchQuery, setSearchQuery] = useState("")
  const [completedAssessments, setCompletedAssessments] = useState<CompletedAssessment[]>([])
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [filterDomain, setFilterDomain] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("completedAssessments")
    if (stored) {
      setCompletedAssessments(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const stats = {
    totalCompleted: completedAssessments.length,
    avgDifficulty: "Medium",
    timeSpent: "45 hours",
    topPlatform: "LeetCode",
  }

  const domainDistribution = completedAssessments.reduce(
    (acc, assessment) => {
      const domain = assessment.domain || "Other"
      acc[domain] = (acc[domain] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const domainColors: Record<string, string> = {
    Aptitude: "#10b981",
    DSA: "#3b82f6",
    OOP: "#8b5cf6",
    OS: "#f59e0b",
    DBMS: "#ef4444",
    Programming: "#06b6d4",
    Other: "#6b7280",
  }

  const totalAssessments = Object.values(domainDistribution).reduce((a, b) => a + b, 0)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "Medium":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleDownloadPDF = () => {
    const pdfContent = `
      Completed Assessments Report
      ============================
      
      Total Completed: ${completedAssessments.length}
      
      ${completedAssessments
        .map(
          (a, i) => `
      ${i + 1}. ${a.title}
         Platform: ${a.platform}
         Completed: ${new Date(a.completedDate).toLocaleDateString()}
         Difficulty: ${a.difficulty}
         Score: ${a.score || "N/A"}
      `,
        )
        .join("\n")}
    `

    const blob = new Blob([pdfContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "completed-assessments.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Report downloaded successfully!")
  }

  const handleExportCSV = () => {
    const headers = ["Title", "Platform", "Completed Date", "Difficulty", "Domain", "Score"]
    const rows = completedAssessments.map((a) => [
      a.title,
      a.platform,
      new Date(a.completedDate).toLocaleDateString(),
      a.difficulty,
      a.domain,
      a.score || "N/A",
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "completed-assessments.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("CSV exported successfully!")
  }

  const handleDelete = (id: string) => {
    const updated = completedAssessments.filter((a) => a.id !== id)
    setCompletedAssessments(updated)
    localStorage.setItem("completedAssessments", JSON.stringify(updated))
    toast.success("Assessment deleted successfully!")
  }

  const filteredAssessments = completedAssessments.filter((assessment) => {
    const matchesSearch =
      searchQuery === "" ||
      assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.completedDate.includes(searchQuery)

    const matchesDifficulty =
      filterDifficulty === "all" || assessment.difficulty.toLowerCase() === filterDifficulty.toLowerCase()

    const matchesDomain = filterDomain === "all" || assessment.domain.toLowerCase() === filterDomain.toLowerCase()

    return matchesSearch && matchesDifficulty && matchesDomain
  })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StudentHeader />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b py-4 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Link href="/student/home" className="hover:text-cyan-600">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">My Completed Assessments</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/student/assessments">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Assessments
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Header */}
        <section className="bg-white py-8 px-4 border-b">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Completed Assessments</h1>
                <p className="text-gray-600">Track your progress and achievements</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportCSV}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Stats Cards */}
              <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Completed</CardDescription>
                    <CardTitle className="text-3xl text-cyan-600">{stats.totalCompleted}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Avg Difficulty</CardDescription>
                    <CardTitle className="text-3xl text-amber-600">{stats.avgDifficulty}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Time Spent</CardDescription>
                    <CardTitle className="text-3xl text-purple-600">{stats.timeSpent}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-3xl text-green-600">{stats.topPlatform}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Practice Distribution</CardTitle>
                  <CardDescription>By domain</CardDescription>
                </CardHeader>
                <CardContent>
                  {totalAssessments > 0 ? (
                    <div className="space-y-3">
                      {/* Simple pie chart visualization */}
                      <div className="relative w-40 h-40 mx-auto">
                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                          {Object.entries(domainDistribution).map(([domain, count], index, arr) => {
                            const percentage = (count / totalAssessments) * 100
                            const prevPercentages = arr
                              .slice(0, index)
                              .reduce((sum, [, c]) => sum + (c / totalAssessments) * 100, 0)
                            const strokeDasharray = `${percentage} ${100 - percentage}`
                            const strokeDashoffset = -prevPercentages

                            return (
                              <circle
                                key={domain}
                                cx="50"
                                cy="50"
                                r="15.9155"
                                fill="transparent"
                                stroke={domainColors[domain] || domainColors.Other}
                                strokeWidth="31.831"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all"
                              />
                            )
                          })}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{totalAssessments}</div>
                            <div className="text-xs text-gray-600">Total</div>
                          </div>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="space-y-2">
                        {Object.entries(domainDistribution).map(([domain, count]) => (
                          <div key={domain} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: domainColors[domain] || domainColors.Other }}
                              />
                              <span className="text-gray-700">{domain}</span>
                            </div>
                            <span className="font-semibold text-gray-900">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No data yet</p>
                      <p className="text-xs mt-1">Complete assessments to see distribution</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Search & Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search by title, platform, or date"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterDomain} onValueChange={setFilterDomain}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Domains</SelectItem>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="dsa">DSA</SelectItem>
                      <SelectItem value="aptitude">Aptitude</SelectItem>
                      <SelectItem value="oop">OOP</SelectItem>
                      <SelectItem value="os">OS</SelectItem>
                      <SelectItem value="dbms">DBMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Completed List */}
            {isLoading ? (
              <Card className="text-center py-16">
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <div className="h-16 w-16 mx-auto mb-4 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading your assessments...</h3>
                  </div>
                </CardContent>
              </Card>
            ) : filteredAssessments.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {completedAssessments.length === 0
                        ? "No completed assessments yet"
                        : "No assessments match your filters"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {completedAssessments.length === 0
                        ? "Start tracking your progress by completing challenges and recording them"
                        : "Try adjusting your search or filter criteria"}
                    </p>
                    {completedAssessments.length === 0 && (
                      <Button asChild>
                        <Link href="/student/assessments">Discover Assessments</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAssessments.map((assessment) => (
                  <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <Image
                          src={assessment.platformLogo || "/placeholder.svg"}
                          alt={assessment.platform}
                          width={48}
                          height={48}
                          className="rounded"
                        />
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{assessment.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>{assessment.platform}</span>
                                <span>•</span>
                                <span>Completed {new Date(assessment.completedDate).toLocaleDateString()}</span>
                                {assessment.score && (
                                  <>
                                    <span>•</span>
                                    <span className="font-medium text-green-600">{assessment.score}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(assessment.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {assessment.notes && <p className="text-sm text-gray-600 mb-3">{assessment.notes}</p>}
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className={getDifficultyColor(assessment.difficulty)}>
                              {assessment.difficulty}
                            </Badge>
                            <Badge variant="outline">{assessment.domain}</Badge>
                            {assessment.topics?.map((topic) => (
                              <Badge key={topic} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
