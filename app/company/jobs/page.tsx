"use client"

import { CompanyHeader } from "@/components/company-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, Calendar, Eye, FileText, MapPin, Plus, Search, Trash2 } from "lucide-react"
import { useState } from "react"

export default function JobPostings() {
  const [showCreateForm, setShowCreateForm] = useState(false)

  const jobs = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "5+ years",
      salary: "$120k - $160k",
      posted: "2 days ago",
      applications: 45,
      views: 234,
      status: "active",
      description: "We're looking for an experienced full-stack developer...",
    },
    {
      id: 2,
      title: "Frontend Developer (React)",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "3+ years",
      salary: "$100k - $140k",
      posted: "5 days ago",
      applications: 67,
      views: 412,
      status: "active",
      description: "Join our frontend team to build amazing user experiences...",
    },
    {
      id: 3,
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "New York, NY",
      type: "Contract",
      experience: "4+ years",
      salary: "$110k - $150k",
      posted: "1 week ago",
      applications: 32,
      views: 189,
      status: "active",
      description: "Help us scale our infrastructure and deployment processes...",
    },
    {
      id: 4,
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      experience: "5+ years",
      salary: "$130k - $170k",
      posted: "2 weeks ago",
      applications: 28,
      views: 156,
      status: "closed",
      description: "Lead product strategy and roadmap for our core platform...",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Postings</h1>
              <p className="text-gray-600">Create and manage your job listings</p>
            </div>
            <Button className="bg-cyan-800 hover:bg-cyan-700" onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4 mr-2" />
              {showCreateForm ? "Cancel" : "Post New Job"}
            </Button>
          </div>

          {showCreateForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Create New Job Posting</CardTitle>
                <CardDescription>Fill in the details for your new job opening</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Job Title</label>
                      <Input placeholder="e.g. Senior Software Engineer" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Department</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <Input placeholder="e.g. Remote, San Francisco" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Job Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Experience Level</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                          <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                          <SelectItem value="senior">Senior (5+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Salary Range</label>
                      <Input placeholder="e.g. $100k - $150k" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Application Deadline</label>
                      <Input type="date" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Job Description</label>
                    <Textarea placeholder="Describe the role, responsibilities, and requirements..." rows={6} />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Required Skills</label>
                    <Input placeholder="e.g. React, Node.js, TypeScript (comma separated)" />
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1 bg-cyan-800 hover:bg-cyan-700">Publish Job</Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Save as Draft
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="active" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="active">Active ({jobs.filter((j) => j.status === "active").length})</TabsTrigger>
                <TabsTrigger value="closed">Closed ({jobs.filter((j) => j.status === "closed").length})</TabsTrigger>
                <TabsTrigger value="draft">Drafts (0)</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search jobs..." className="pl-10 w-64" />
                </div>
              </div>
            </div>

            <TabsContent value="active" className="space-y-4">
              {jobs
                .filter((job) => job.status === "active")
                .map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <Badge className="bg-green-100 text-green-800">{job.status}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {job.type}
                            </span>
                            <span>Experience: {job.experience}</span>
                            <span>Salary: {job.salary}</span>
                          </div>
                          <p className="text-gray-600 mb-4">{job.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Applications:</span>
                            <span className="font-semibold">{job.applications}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Views:</span>
                            <span className="font-semibold">{job.views}</span>
                          </div>
                          <span className="text-gray-500">Posted {job.posted}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" className="bg-cyan-800 hover:bg-cyan-700">
                            View Applicants
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="closed" className="space-y-4">
              {jobs
                .filter((job) => job.status === "closed")
                .map((job) => (
                  <Card key={job.id} className="opacity-75">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <Badge variant="secondary">{job.status}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span>Posted {job.posted}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-6 text-sm">
                          <span className="text-gray-600">
                            Total Applications: <span className="font-semibold">{job.applications}</span>
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Report
                          </Button>
                          <Button size="sm" variant="outline">
                            Repost
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="draft">
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Draft Jobs</h3>
                  <p className="text-gray-600 mb-4">You don't have any draft job postings</p>
                  <Button className="bg-cyan-800 hover:bg-cyan-700" onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Job
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
