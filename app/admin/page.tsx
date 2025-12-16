"use client"

import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Building2, Briefcase, AlertCircle, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const registrationData = [
  { month: "Jan", students: 45, companies: 5 },
  { month: "Feb", students: 62, companies: 8 },
  { month: "Mar", students: 78, companies: 12 },
  { month: "Apr", students: 95, companies: 15 },
  { month: "May", students: 120, companies: 18 },
  { month: "Jun", students: 145, companies: 22 },
]

const careerGoalData = [
  { name: "Top Tech Job", value: 450, color: "#0891b2" },
  { name: "Higher Studies", value: 280, color: "#8b5cf6" },
  { name: "Entrepreneurship", value: 120, color: "#f59e0b" },
  { name: "Not Decided", value: 150, color: "#6b7280" },
]

const applicationData = [
  { week: "Week 1", applications: 45 },
  { week: "Week 2", applications: 62 },
  { week: "Week 3", applications: 78 },
  { week: "Week 4", applications: 95 },
  { week: "Week 5", applications: 88 },
  { week: "Week 6", applications: 102 },
]

const recentActivity = [
  { type: "registration", user: "Rahul Sharma", action: "New student registration", time: "2 minutes ago" },
  { type: "posting", user: "TechCorp", action: "Posted Software Engineer Intern", time: "15 minutes ago" },
  { type: "application", user: "Priya Patel", action: "Applied to Data Analyst role", time: "32 minutes ago" },
  { type: "approval", user: "Admin", action: "Approved internship posting", time: "1 hour ago" },
  { type: "selection", user: "Google", action: "Selected Amit Kumar", time: "2 hours ago" },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      activeStudents: 1245,
      verifiedCompanies: 87,
      pendingApprovals: 23,
      activeInternships: 156,
      registrationData,
      careerGoalData,
      applicationData,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `intelacad-report-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Report exported successfully!")
  }

  const handleSendNotification = () => {
    router.push("/admin/notifications")
    toast.success("Navigating to notifications page...")
  }

  const dummyNotifications = [
    { id: 1, message: "New student registration: Rahul Sharma", time: "2 minutes ago", type: "info" },
    {
      id: 2,
      message: "Internship posting approved: Software Engineer at TechCorp",
      time: "15 minutes ago",
      type: "success",
    },
    { id: 3, message: "Pending approval: Data Analyst role at DataViz", time: "1 hour ago", type: "warning" },
    { id: 4, message: "Company verification completed: CloudTech Systems", time: "2 hours ago", type: "success" },
    { id: 5, message: "New application received for Full Stack Developer", time: "3 hours ago", type: "info" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of platform activity and metrics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" onClick={() => setShowNotifications(true)}>
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleExportReport}>
              Export Report
            </Button>
            <Button onClick={handleSendNotification}>Send Notification</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,245</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
              <p className="text-xs text-muted-foreground mt-1">892 logged in this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Verified Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> from last month
              </p>
              <p className="text-xs text-muted-foreground mt-1">12 pending verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Requires immediate attention</p>
              <p className="text-xs text-muted-foreground mt-1">18 internships, 5 companies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+18</span> new this week
              </p>
              <p className="text-xs text-muted-foreground mt-1">342 total applications</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* User Registrations Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Registrations Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={registrationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="students" stroke="#0891b2" strokeWidth={2} />
                  <Line type="monotone" dataKey="companies" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Career Goals Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Students by Career Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={careerGoalData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {careerGoalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Applications Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Applications by Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#0891b2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className="h-2 w-2 rounded-full bg-cyan-600 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> - {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>Recent platform activity and updates</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dummyNotifications.map((notification) => (
              <div key={notification.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
