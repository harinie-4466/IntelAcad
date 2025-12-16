"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

// Declare the variables before using them
const atsScoreData = [
  { range: "0-20", count: 45 },
  { range: "21-40", count: 120 },
  { range: "41-60", count: 280 },
  { range: "61-80", count: 450 },
  { range: "81-100", count: 350 },
]

const placementData = [
  { month: "Jan", placed: 25, offers: 32 },
  { month: "Feb", placed: 30, offers: 38 },
  { month: "Mar", placed: 45, offers: 52 },
  { month: "Apr", placed: 38, offers: 45 },
  { month: "May", placed: 52, offers: 60 },
  { month: "Jun", placed: 48, offers: 55 },
]

const skillCoverageData = [
  { skill: "Technical", coverage: 85 },
  { skill: "Communication", coverage: 72 },
  { skill: "Problem Solving", coverage: 78 },
  { skill: "Leadership", coverage: 65 },
  { skill: "Teamwork", coverage: 80 },
]

const readinessData = [
  { category: "Interview Ready", value: 420 },
  { category: "Needs Practice", value: 580 },
  { category: "Not Ready", value: 245 },
]

const applicationFunnelData = [
  { stage: "Applied", count: 1245 },
  { stage: "Shortlisted", count: 680 },
  { stage: "Interview", count: 420 },
  { stage: "Offer", count: 185 },
  { stage: "Accepted", count: 152 },
]

const COLORS = ["#0891b2", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"]

export default function AnalyticsPage() {
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [userType, setUserType] = useState("all")
  const [contentType, setContentType] = useState("all")
  const [department, setDepartment] = useState("all")
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleShowAnalytics = () => {
    const newErrors: { [key: string]: string } = {}

    if (!dateFrom) {
      newErrors.dateFrom = "From date is required"
    }
    if (!dateTo) {
      newErrors.dateTo = "To date is required"
    }
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      newErrors.dateTo = "To date must be after from date"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error("Please fix the errors before showing analytics")
      return
    }

    setErrors({})
    setShowAnalytics(true)
    toast.success("Analytics updated based on your filters!")
  }

  const handleExportReport = async () => {
    toast.info("Generating PDF report...")

    const element = document.getElementById("analytics-content")
    if (!element) {
      toast.error("Unable to generate report")
      return
    }

    try {
      const canvas = await html2canvas(element)
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`analytics-report-${new Date().toISOString().split("T")[0]}.pdf`)
      toast.success("Report exported successfully!")
    } catch (error) {
      toast.error("Failed to export report")
    }
  }

  const getFilteredData = () => {
    // In a real app, this would filter the actual data based on the form inputs
    // For now, we'll just return the existing data
    return {
      atsScoreData,
      placementData,
      skillCoverageData,
      readinessData,
      applicationFunnelData,
    }
  }

  const filteredData = showAnalytics
    ? getFilteredData()
    : {
        atsScoreData,
        placementData,
        skillCoverageData,
        readinessData,
        applicationFunnelData,
      }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto max-w-7xl px-6 py-8" id="analytics-content">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics & Reports</h1>
            <p className="text-muted-foreground">Comprehensive platform analytics and insights</p>
          </div>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="bg-gray-100 -mx-6 px-6 py-4">
            <div className="max-w-7xl mx-auto">
              <TabsList className="bg-transparent w-full justify-start">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="applications" className="data-[state=active]:bg-white">
                  Applications
                </TabsTrigger>
                <TabsTrigger value="ats" className="data-[state=active]:bg-white">
                  ATS Scores
                </TabsTrigger>
                <TabsTrigger value="placements" className="data-[state=active]:bg-white">
                  Placements
                </TabsTrigger>
                <TabsTrigger value="readiness" className="data-[state=active]:bg-white">
                  Readiness
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label>From Date *</Label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        setDateFrom(e.target.value)
                        setErrors({ ...errors, dateFrom: "" })
                      }}
                      className={errors.dateFrom ? "border-red-500" : ""}
                    />
                    {errors.dateFrom && <p className="text-xs text-red-500">{errors.dateFrom}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>To Date *</Label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => {
                        setDateTo(e.target.value)
                        setErrors({ ...errors, dateTo: "" })
                      }}
                      className={errors.dateTo ? "border-red-500" : ""}
                    />
                    {errors.dateTo && <p className="text-xs text-red-500">{errors.dateTo}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>User Type</Label>
                    <Select value={userType} onValueChange={setUserType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="students">Students Only</SelectItem>
                        <SelectItem value="companies">Companies Only</SelectItem>
                        <SelectItem value="active">Active Users</SelectItem>
                        <SelectItem value="inactive">Inactive Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Content</SelectItem>
                        <SelectItem value="internships">Internships</SelectItem>
                        <SelectItem value="jobs">Jobs</SelectItem>
                        <SelectItem value="assessments">Assessments</SelectItem>
                        <SelectItem value="certifications">Certifications</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="cse">Computer Science</SelectItem>
                        <SelectItem value="ece">Electronics</SelectItem>
                        <SelectItem value="mech">Mechanical</SelectItem>
                        <SelectItem value="civil">Civil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Placement Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="placed">Placed</SelectItem>
                        <SelectItem value="not-placed">Not Placed</SelectItem>
                        <SelectItem value="in-process">In Process</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="w-full" onClick={handleShowAnalytics}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Show Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            {showAnalytics && (
              <>
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Funnel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={filteredData.applicationFunnelData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="stage" type="category" />
                          <Tooltip />
                          <Bar dataKey="count" fill="#0891b2" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Skill Coverage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={filteredData.skillCoverageData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="skill" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar name="Coverage" dataKey="coverage" stroke="#0891b2" fill="#0891b2" fillOpacity={0.6} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-cyan-600">1,245</div>
                        <div className="text-sm text-muted-foreground mt-1">Total Students</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">185</div>
                        <div className="text-sm text-muted-foreground mt-1">Placements</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">72.5%</div>
                        <div className="text-sm text-muted-foreground mt-1">Avg ATS Score</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">420</div>
                        <div className="text-sm text-muted-foreground mt-1">Active Applications</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Application Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={applicationFunnelData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="stage" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0891b2" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Application Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={applicationFunnelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ stage, percent }) => `${stage}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {applicationFunnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ats" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>ATS Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={atsScoreData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average ATS Score Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={placementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="placed" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">72.5%</div>
                    <div className="text-sm text-muted-foreground mt-1">Average ATS Score</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-600">350</div>
                    <div className="text-sm text-muted-foreground mt-1">High Scorers (81-100)</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">165</div>
                    <div className="text-sm text-muted-foreground mt-1">Need Improvement (&lt;40)</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="placements" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Placement Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={placementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="placed" stroke="#8b5cf6" strokeWidth={2} name="Placed" />
                      <Line type="monotone" dataKey="offers" stroke="#0891b2" strokeWidth={2} name="Offers" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Placement by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { dept: "CSE", count: 85 },
                        { dept: "ECE", count: 42 },
                        { dept: "Mech", count: 28 },
                        { dept: "Civil", count: 30 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dept" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">185</div>
                    <div className="text-sm text-muted-foreground mt-1">Total Placements</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-600">282</div>
                    <div className="text-sm text-muted-foreground mt-1">Total Offers</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">14.9%</div>
                    <div className="text-sm text-muted-foreground mt-1">Placement Rate</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">₹8.5L</div>
                    <div className="text-sm text-muted-foreground mt-1">Avg Package</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="readiness" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Student Readiness Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={readinessData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {readinessData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skill Coverage Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={skillCoverageData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Coverage" dataKey="coverage" stroke="#0891b2" fill="#0891b2" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-600">420</div>
                    <div className="text-sm text-muted-foreground mt-1">Interview Ready</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">580</div>
                    <div className="text-sm text-muted-foreground mt-1">Needs Practice</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">245</div>
                    <div className="text-sm text-muted-foreground mt-1">Not Ready</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
