"use client"

import { CompanyHeader } from "@/components/company-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, Briefcase, Download, Filter, Mail, MapPin, Phone, Search, Star, UserCheck } from "lucide-react"

export default function Candidates() {
  const candidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (234) 567-8900",
      position: "Senior Full Stack Developer",
      location: "San Francisco, CA",
      experience: "5 years",
      education: "B.S. Computer Science, Stanford",
      skills: ["React", "Node.js", "AWS", "TypeScript", "Docker"],
      appliedDate: "2 hours ago",
      status: "new",
      matchScore: 92,
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "+1 (234) 567-8901",
      position: "Frontend Developer (React)",
      location: "Remote",
      experience: "3 years",
      education: "B.Tech CSE, MIT",
      skills: ["React", "TypeScript", "Next.js", "Tailwind", "GraphQL"],
      appliedDate: "5 hours ago",
      status: "shortlisted",
      matchScore: 88,
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.r@email.com",
      phone: "+1 (234) 567-8902",
      position: "DevOps Engineer",
      location: "New York, NY",
      experience: "4 years",
      education: "M.S. Computer Engineering, CMU",
      skills: ["Docker", "Kubernetes", "AWS", "Terraform", "Jenkins"],
      appliedDate: "1 day ago",
      status: "interview",
      matchScore: 85,
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 4,
      name: "Alex Thompson",
      email: "alex.t@email.com",
      phone: "+1 (234) 567-8903",
      position: "Senior Full Stack Developer",
      location: "Austin, TX",
      experience: "6 years",
      education: "B.S. Software Engineering, UC Berkeley",
      skills: ["Python", "Django", "React", "PostgreSQL", "Redis"],
      appliedDate: "2 days ago",
      status: "shortlisted",
      matchScore: 90,
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "shortlisted":
        return "bg-purple-100 text-purple-800"
      case "interview":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidate Management</h1>
            <p className="text-gray-600">Review and manage job applications</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">348</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">New Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">45</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Shortlisted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">67</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">In Interview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">23</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Candidates</TabsTrigger>
                <TabsTrigger value="new">New (45)</TabsTrigger>
                <TabsTrigger value="shortlisted">Shortlisted (67)</TabsTrigger>
                <TabsTrigger value="interview">Interview (23)</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search candidates..." className="pl-10 w-64" />
                </div>
                <Select>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="position">Position</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="score">Match Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-6">
                      <img
                        src={candidate.avatar || "/placeholder.svg"}
                        alt={candidate.name}
                        className="h-20 w-20 rounded-full object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-xl font-semibold">{candidate.name}</h3>
                              <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                            </div>
                            <p className="text-gray-600 mb-2">Applied for: {candidate.position}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {candidate.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {candidate.experience}
                              </span>
                              <span className="flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                {candidate.education}
                              </span>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                              <span className={`text-2xl font-bold ${getMatchScoreColor(candidate.matchScore)}`}>
                                {candidate.matchScore}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">Match Score</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {candidate.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {candidate.phone}
                            </span>
                            <span>Applied {candidate.appliedDate}</span>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Resume
                            </Button>
                            <Button size="sm" variant="outline">
                              View Profile
                            </Button>
                            <Button size="sm" className="bg-cyan-800 hover:bg-cyan-700">
                              <UserCheck className="h-4 w-4 mr-2" />
                              Shortlist
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="new" className="space-y-4">
              {candidates
                .filter((c) => c.status === "new")
                .map((candidate) => (
                  <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-6">
                        <img
                          src={candidate.avatar || "/placeholder.svg"}
                          alt={candidate.name}
                          className="h-20 w-20 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{candidate.name}</h3>
                              <p className="text-gray-600">{candidate.position}</p>
                            </div>
                            <Button size="sm" className="bg-cyan-800 hover:bg-cyan-700">
                              Review Application
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="shortlisted" className="space-y-4">
              {candidates
                .filter((c) => c.status === "shortlisted")
                .map((candidate) => (
                  <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-6">
                        <img
                          src={candidate.avatar || "/placeholder.svg"}
                          alt={candidate.name}
                          className="h-20 w-20 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{candidate.name}</h3>
                              <p className="text-gray-600">{candidate.position}</p>
                            </div>
                            <Button size="sm" className="bg-cyan-800 hover:bg-cyan-700">
                              Schedule Interview
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="interview" className="space-y-4">
              {candidates
                .filter((c) => c.status === "interview")
                .map((candidate) => (
                  <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-6">
                        <img
                          src={candidate.avatar || "/placeholder.svg"}
                          alt={candidate.name}
                          className="h-20 w-20 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{candidate.name}</h3>
                              <p className="text-gray-600">{candidate.position}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                View Feedback
                              </Button>
                              <Button size="sm" className="bg-cyan-800 hover:bg-cyan-700">
                                Next Round
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
