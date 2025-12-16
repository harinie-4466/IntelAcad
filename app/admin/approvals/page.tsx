"use client"
import { useState } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  RotateCcw,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const pendingPostings = [
  {
    id: 1,
    company: "TechCorp Solutions",
    role: "Software Engineer Intern",
    location: "Bangalore, India",
    type: "Remote",
    stipend: "₹25,000/month",
    posted: "2 hours ago",
    description: "Looking for talented software engineering interns...",
  },
  {
    id: 2,
    company: "DataViz Inc",
    role: "Data Analyst Intern",
    location: "Mumbai, India",
    type: "Hybrid",
    stipend: "₹20,000/month",
    posted: "5 hours ago",
    description: "Seeking data analyst interns with strong analytical skills...",
  },
  {
    id: 3,
    company: "CloudTech Systems",
    role: "DevOps Intern",
    location: "Hyderabad, India",
    type: "Onsite",
    stipend: "₹22,000/month",
    posted: "1 day ago",
    description: "Join our DevOps team to learn cloud infrastructure...",
  },
]

const approvedPostings = [
  {
    id: 4,
    company: "Google India",
    role: "SWE Intern",
    approvedBy: "Admin",
    approvedDate: "2024-01-08",
  },
  {
    id: 5,
    company: "Microsoft",
    role: "Product Manager Intern",
    approvedBy: "Admin",
    approvedDate: "2024-01-07",
  },
]

export default function ApprovalsPage() {
  const [selectedTab, setSelectedTab] = useState("postings")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterLocation, setFilterLocation] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [filteredPostings, setFilteredPostings] = useState(pendingPostings)
  const [approvedList, setApprovedList] = useState(approvedPostings)
  const [rejectedList, setRejectedList] = useState<any[]>([])
  const [pendingList, setPendingList] = useState(pendingPostings)

  const handleSearch = () => {
    const filtered = pendingList.filter((posting) => {
      const matchesSearch =
        posting.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        posting.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        posting.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = filterType === "all" || posting.type.toLowerCase() === filterType
      const matchesLocation = filterLocation === "all" || posting.location.toLowerCase().includes(filterLocation)

      return matchesSearch && matchesType && matchesLocation
    })

    setFilteredPostings(filtered)
    toast.success(`Found ${filtered.length} results`)
  }

  const handleApprove = (posting: any) => {
    const approvedPosting = {
      id: posting.id,
      company: posting.company,
      role: posting.role,
      approvedBy: "Admin",
      approvedDate: new Date().toISOString().split("T")[0],
    }
    setApprovedList([...approvedList, approvedPosting])
    setPendingList(pendingList.filter((p) => p.id !== posting.id))
    setFilteredPostings(filteredPostings.filter((p) => p.id !== posting.id))
    toast.success("Internship posting approved successfully!")
  }

  const handleRequestChanges = () => {
    toast.info("Change request sent to company")
  }

  const handleReject = (posting: any, reason: string) => {
    const rejectedPosting = {
      ...posting,
      rejectedBy: "Admin",
      rejectedDate: new Date().toISOString().split("T")[0],
      rejectionReason: reason,
    }
    setRejectedList([...rejectedList, rejectedPosting])
    setPendingList(pendingList.filter((p) => p.id !== posting.id))
    setFilteredPostings(filteredPostings.filter((p) => p.id !== posting.id))
    toast.error("Internship posting rejected")
  }

  const handleRestore = (posting: any) => {
    setPendingList([...pendingList, posting])
    setFilteredPostings([...filteredPostings, posting])
    setRejectedList(rejectedList.filter((p) => p.id !== posting.id))
    toast.success("Posting restored to approval queue")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Approval Queue</h1>
          <p className="text-muted-foreground">Review and approve internship postings and company verifications</p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by company, role, or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Approvals</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">From</Label>
                      <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">To</Label>
                      <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="onsite">Onsite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Stipend Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ranges</SelectItem>
                      <SelectItem value="0-15k">₹0 - ₹15,000</SelectItem>
                      <SelectItem value="15k-25k">₹15,000 - ₹25,000</SelectItem>
                      <SelectItem value="25k+">₹25,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleSearch}>
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <div className="bg-gray-100 -mx-6 px-6 py-4">
            <div className="max-w-7xl mx-auto">
              <TabsList className="bg-transparent w-full justify-start">
                <TabsTrigger value="postings" className="data-[state=active]:bg-white">
                  Internship Postings
                  <Badge className="ml-2 bg-orange-500">{filteredPostings.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="companies" className="data-[state=active]:bg-white">
                  Company Verifications
                </TabsTrigger>
                <TabsTrigger value="approved" className="data-[state=active]:bg-white">
                  Approved
                  <Badge className="ml-2 bg-green-500">{approvedList.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="data-[state=active]:bg-white">
                  Rejected
                  <Badge className="ml-2 bg-red-500">{rejectedList.length}</Badge>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="postings" className="space-y-4">
            {filteredPostings.map((posting) => (
              <Card key={posting.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{posting.role}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        {posting.company}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{posting.location}</span>
                      <Badge variant="secondary">{posting.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{posting.stipend}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Posted {posting.posted}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{posting.description}</p>

                  <div className="flex gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Approval</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Are you sure you want to approve this internship posting?
                          </p>
                          <div className="space-y-2">
                            <Label>Admin Notes (Optional)</Label>
                            <Textarea placeholder="Add any internal notes..." />
                          </div>
                          <div className="flex gap-3">
                            <Button className="flex-1" onClick={() => handleApprove(posting)}>
                              Confirm Approval
                            </Button>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="flex-1 bg-transparent">
                                Cancel
                              </Button>
                            </DialogTrigger>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          Request Changes
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Request Changes</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Feedback to Company</Label>
                            <Textarea placeholder="Explain what changes are needed..." className="min-h-32" />
                          </div>
                          <div className="flex gap-3">
                            <Button className="flex-1" onClick={handleRequestChanges}>
                              Send Feedback
                            </Button>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="flex-1 bg-transparent">
                                Cancel
                              </Button>
                            </DialogTrigger>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="flex-1">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Rejection</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Rejection Reason (Required)</Label>
                            <Textarea
                              id={`reject-reason-${posting.id}`}
                              placeholder="Explain why this posting is being rejected..."
                              className="min-h-32"
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button
                              variant="destructive"
                              className="flex-1"
                              onClick={() => {
                                const reason =
                                  (document.getElementById(`reject-reason-${posting.id}`) as HTMLTextAreaElement)
                                    ?.value || ""
                                handleReject(posting, reason)
                              }}
                            >
                              Confirm Rejection
                            </Button>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="flex-1 bg-transparent">
                                Cancel
                              </Button>
                            </DialogTrigger>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="companies">
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No pending company verifications</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {approvedList.map((posting) => (
              <Card key={posting.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{posting.role}</h3>
                      <p className="text-sm text-muted-foreground">{posting.company}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500 mb-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        by {posting.approvedBy} on {posting.approvedDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedList.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <XCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No rejected postings</p>
                </CardContent>
              </Card>
            ) : (
              rejectedList.map((posting) => (
                <Card key={posting.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{posting.role}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          {posting.company}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        <XCircle className="h-3 w-3 mr-1" />
                        Rejected
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <Label className="text-sm font-semibold">Rejection Reason:</Label>
                      <p className="text-sm text-muted-foreground mt-1">{posting.rejectionReason}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Rejected by {posting.rejectedBy} on {posting.rejectedDate}
                    </div>
                    <Button className="w-full" onClick={() => handleRestore(posting)}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore to Approval Queue
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
