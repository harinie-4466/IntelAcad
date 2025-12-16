"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Download,
  Search,
  Eye,
  Mail,
  Phone,
  GraduationCap,
  FileText,
  Home,
  Briefcase,
  PlusCircle,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock applicant data - in production, this would come from a database
const mockApplicants = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@university.edu",
    contactNumber: "+91 9876543210",
    rollNumber: "CS2021001",
    branch: "Computer Science Engineering",
    year: "3",
    cgpa: "8.5",
    appliedFor: "Full Stack Developer Intern",
    appliedDate: "2024-01-15",
    status: "Under Review",
    technicalSkills: ["React", "Node.js", "MongoDB", "Git", "JavaScript"],
    completedCourses: ["Data Structures", "Algorithms", "Web Technologies"],
    careerInterests: ["Web Development", "Full Stack Development"],
    careerBio: "Passionate about building scalable web applications and learning new technologies.",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@university.edu",
    contactNumber: "+91 9876543211",
    rollNumber: "CS2021002",
    branch: "Computer Science Engineering",
    year: "4",
    cgpa: "9.2",
    appliedFor: "Machine Learning Intern",
    appliedDate: "2024-01-14",
    status: "Shortlisted",
    technicalSkills: ["Python", "TensorFlow", "Data Analysis", "Machine Learning"],
    completedCourses: ["Machine Learning", "Artificial Intelligence", "Data Structures"],
    careerInterests: ["Machine Learning", "Data Science", "AI Research"],
    careerBio: "Enthusiastic about AI and ML with hands-on experience in building predictive models.",
  },
  {
    id: 3,
    name: "Arjun Kumar",
    email: "arjun.kumar@university.edu",
    contactNumber: "+91 9876543212",
    rollNumber: "IT2021003",
    branch: "Information Technology",
    year: "3",
    cgpa: "8.8",
    appliedFor: "Full Stack Developer Intern",
    appliedDate: "2024-01-13",
    status: "Interview Scheduled",
    technicalSkills: ["React", "Node.js", "Express", "PostgreSQL", "Docker"],
    completedCourses: ["Database Management", "Software Engineering", "Web Technologies"],
    careerInterests: ["Web Development", "DevOps", "Cloud Computing"],
    careerBio: "Full-stack developer with a passion for creating efficient and scalable applications.",
  },
  {
    id: 4,
    name: "Ananya Singh",
    email: "ananya.singh@university.edu",
    contactNumber: "+91 9876543213",
    rollNumber: "CS2022004",
    branch: "Computer Science Engineering",
    year: "2",
    cgpa: "9.0",
    appliedFor: "Mobile App Developer Intern",
    appliedDate: "2024-01-12",
    status: "Under Review",
    technicalSkills: ["React Native", "JavaScript", "Mobile UI/UX", "REST APIs"],
    completedCourses: ["Mobile Computing", "Data Structures", "Algorithms"],
    careerInterests: ["Mobile Development", "UI/UX Design"],
    careerBio: "Mobile app developer focused on creating intuitive user experiences.",
  },
  {
    id: 5,
    name: "Vikram Reddy",
    email: "vikram.reddy@university.edu",
    contactNumber: "+91 9876543214",
    rollNumber: "CS2021005",
    branch: "Computer Science Engineering",
    year: "3",
    cgpa: "8.3",
    appliedFor: "Data Science Intern",
    appliedDate: "2024-01-11",
    status: "Rejected",
    technicalSkills: ["Python", "SQL", "Pandas", "Data Visualization"],
    completedCourses: ["Data Structures", "Database Management", "Statistics"],
    careerInterests: ["Data Science", "Analytics", "Business Intelligence"],
    careerBio: "Data enthusiast with strong analytical skills and experience in data visualization.",
  },
]

export default function ApplicantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPosition, setFilterPosition] = useState("all")
  const [selectedApplicant, setSelectedApplicant] = useState<(typeof mockApplicants)[0] | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const positions = Array.from(new Set(mockApplicants.map((a) => a.appliedFor)))

  const filteredApplicants = mockApplicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || applicant.status === filterStatus
    const matchesPosition = filterPosition === "all" || applicant.appliedFor === filterPosition

    return matchesSearch && matchesStatus && matchesPosition
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review":
        return "bg-blue-100 text-blue-800"
      case "Shortlisted":
        return "bg-green-100 text-green-800"
      case "Interview Scheduled":
        return "bg-purple-100 text-purple-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Contact Number",
      "Roll Number",
      "Branch",
      "Year",
      "CGPA",
      "Applied For",
      "Applied Date",
      "Status",
      "Technical Skills",
      "Completed Courses",
      "Career Interests",
    ]

    const rows = filteredApplicants.map((applicant) => [
      applicant.name,
      applicant.email,
      applicant.contactNumber,
      applicant.rollNumber,
      applicant.branch,
      applicant.year,
      applicant.cgpa,
      applicant.appliedFor,
      applicant.appliedDate,
      applicant.status,
      applicant.technicalSkills.join("; "),
      applicant.completedCourses.join("; "),
      applicant.careerInterests.join("; "),
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `applicants_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToJSON = () => {
    const dataStr = JSON.stringify(filteredApplicants, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `applicants_${new Date().toISOString().split("T")[0]}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-700 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Applicants</span>
          </Link>
          <Link
            href="/company/reports"
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-cyan-700 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="w-4 h-4" />
                <span className="font-medium">Applicants</span>
              </Link>
              <Link
                href="/company/reports"
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
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Applicants</h1>
            <p className="text-gray-600">Manage and review internship applications</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">Total Applicants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-cyan-800">{mockApplicants.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">Under Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {mockApplicants.filter((a) => a.status === "Under Review").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">Shortlisted</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {mockApplicants.filter((a) => a.status === "Shortlisted").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">
                  {mockApplicants.filter((a) => a.status === "Interview Scheduled").length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or roll number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterPosition} onValueChange={setFilterPosition}>
                  <SelectTrigger className="w-full md:w-[250px]">
                    <SelectValue placeholder="Filter by position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button onClick={exportToCSV} variant="outline" className="bg-white">
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button onClick={exportToJSON} variant="outline" className="bg-white">
                    <Download className="h-4 w-4 mr-2" />
                    JSON
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applicants Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Applicants ({filteredApplicants.length})</CardTitle>
              <CardDescription>Review and manage student applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>CGPA</TableHead>
                      <TableHead>Applied For</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell className="font-medium">{applicant.name}</TableCell>
                        <TableCell>{applicant.email}</TableCell>
                        <TableCell>{applicant.rollNumber}</TableCell>
                        <TableCell>{applicant.branch}</TableCell>
                        <TableCell>{applicant.year}</TableCell>
                        <TableCell className="font-semibold">{applicant.cgpa}</TableCell>
                        <TableCell>{applicant.appliedFor}</TableCell>
                        <TableCell>{new Date(applicant.appliedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(applicant.status)}>{applicant.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedApplicant(applicant)}
                            className="bg-white"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Applicant Details Dialog */}
      <Dialog open={!!selectedApplicant} onOpenChange={() => setSelectedApplicant(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
            <DialogDescription>Complete profile and application information</DialogDescription>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-cyan-800" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold">{selectedApplicant.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Roll Number</p>
                      <p className="font-semibold">{selectedApplicant.rollNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email
                      </p>
                      <p className="font-semibold">{selectedApplicant.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Contact Number
                      </p>
                      <p className="font-semibold">{selectedApplicant.contactNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Academic Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Branch</p>
                      <p className="font-semibold">{selectedApplicant.branch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Year of Study</p>
                      <p className="font-semibold">{selectedApplicant.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CGPA</p>
                      <p className="font-semibold text-cyan-800">{selectedApplicant.cgpa}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Completed Courses</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.completedCourses.map((course, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technical Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant.technicalSkills.map((skill, index) => (
                      <Badge key={index} className="bg-cyan-100 text-cyan-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Career Interests */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Career Interests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant.careerInterests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="bg-purple-50">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Career Bio</p>
                    <p className="text-gray-700">{selectedApplicant.careerBio}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Application Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-cyan-800" />
                    Application Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Applied For</p>
                      <p className="font-semibold">{selectedApplicant.appliedFor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Applied Date</p>
                      <p className="font-semibold">{new Date(selectedApplicant.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={getStatusColor(selectedApplicant.status)}>{selectedApplicant.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
