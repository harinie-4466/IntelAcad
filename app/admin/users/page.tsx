"use client"

import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, Eye, Edit, Trash2, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const students = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    university: "IIT Delhi",
    year: "3rd Year",
    cgpa: 8.5,
    status: "Active",
    verified: true,
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@example.com",
    university: "BITS Pilani",
    year: "4th Year",
    cgpa: 9.2,
    status: "Active",
    verified: true,
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@example.com",
    university: "NIT Trichy",
    year: "2nd Year",
    cgpa: 7.8,
    status: "Active",
    verified: false,
  },
  {
    id: 4,
    name: "Sneha Reddy",
    email: "sneha@example.com",
    university: "VIT Vellore",
    year: "3rd Year",
    cgpa: 8.9,
    status: "Active",
    verified: true,
  },
]

const companies = [
  {
    id: 1,
    name: "TechCorp Solutions",
    email: "hr@techcorp.com",
    industry: "IT Services",
    postings: 5,
    status: "Active",
    verified: true,
  },
  {
    id: 2,
    name: "DataViz Inc",
    email: "contact@dataviz.com",
    industry: "Analytics",
    postings: 3,
    status: "Active",
    verified: true,
  },
  {
    id: 3,
    name: "CloudTech Systems",
    email: "jobs@cloudtech.com",
    industry: "Cloud Computing",
    postings: 2,
    status: "Active",
    verified: false,
  },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredStudents, setFilteredStudents] = useState(students)
  const [filteredCompanies, setFilteredCompanies] = useState(companies)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [deletedAccounts, setDeletedAccounts] = useState<any[]>([])
  const [showViewProfile, setShowViewProfile] = useState(false)
  const [showEditDetails, setShowEditDetails] = useState(false)
  const [editFormData, setEditFormData] = useState<any>({})

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const lowerQuery = query.toLowerCase()

    setFilteredStudents(
      students.filter(
        (s) =>
          s.name.toLowerCase().includes(lowerQuery) ||
          s.email.toLowerCase().includes(lowerQuery) ||
          s.university.toLowerCase().includes(lowerQuery),
      ),
    )

    setFilteredCompanies(
      companies.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerQuery) ||
          c.email.toLowerCase().includes(lowerQuery) ||
          c.industry.toLowerCase().includes(lowerQuery),
      ),
    )
  }

  const handleExportCSV = () => {
    const csvContent = [
      ["Name", "Email", "University", "Year", "CGPA", "Status"],
      ...students.map((s) => [s.name, s.email, s.university, s.year, s.cgpa, s.status]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `students-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("CSV exported successfully!")
  }

  const handleViewProfile = (user: any) => {
    setSelectedUser(user)
    setShowViewProfile(true)
  }

  const handleEditDetails = (user: any) => {
    setSelectedUser(user)
    setEditFormData(user)
    setShowEditDetails(true)
  }

  const handleDeleteAccount = (user: any, type: "student" | "company" = "student") => {
    setSelectedUser({ ...user, type })
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (selectedUser) {
      setDeletedAccounts([...deletedAccounts, selectedUser])
      if (selectedUser.type === "company") {
        setFilteredCompanies(filteredCompanies.filter((c) => c.id !== selectedUser.id))
      } else {
        setFilteredStudents(filteredStudents.filter((s) => s.id !== selectedUser.id))
      }
      toast.success(`Account deleted: ${selectedUser.name}`)
    }
    setShowDeleteDialog(false)
    setSelectedUser(null)
  }

  const handleRetrieve = (account: any) => {
    if (account.type === "company") {
      setFilteredCompanies([...filteredCompanies, account])
    } else {
      setFilteredStudents([...filteredStudents, account])
    }
    setDeletedAccounts(deletedAccounts.filter((a) => a.id !== account.id))
    toast.success(`Account retrieved: ${account.name}`)
  }

  const handleSaveEditedDetails = () => {
    if (selectedUser) {
      if (selectedUser.university) {
        // Student
        setFilteredStudents(filteredStudents.map((s) => (s.id === selectedUser.id ? { ...s, ...editFormData } : s)))
      } else {
        // Company
        setFilteredCompanies(filteredCompanies.map((c) => (c.id === selectedUser.id ? { ...c, ...editFormData } : c)))
      }
      toast.success("Details updated successfully!")
      setShowEditDetails(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage students, companies, and their accounts</p>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <div className="bg-gray-100 -mx-6 px-6 py-4">
            <div className="max-w-7xl mx-auto">
              <TabsList className="bg-transparent w-full justify-start">
                <TabsTrigger value="students" className="data-[state=active]:bg-white">
                  Students ({filteredStudents.length})
                </TabsTrigger>
                <TabsTrigger value="companies" className="data-[state=active]:bg-white">
                  Companies ({filteredCompanies.length})
                </TabsTrigger>
                <TabsTrigger value="retrieve" className="data-[state=active]:bg-white">
                  Retrieve ({deletedAccounts.length})
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or university..."
                className="pl-10 text-foreground placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>CGPA</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {student.name}
                            {student.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.university}</TableCell>
                        <TableCell>{student.year}</TableCell>
                        <TableCell>{student.cgpa}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">{student.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewProfile(student)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditDetails(student)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteAccount(student)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Company Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Active Postings</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {company.name}
                            {company.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{company.email}</TableCell>
                        <TableCell>{company.industry}</TableCell>
                        <TableCell>{company.postings}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">{company.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewProfile(company)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditDetails(company)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteAccount(company, "company")}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="retrieve">
            <Card>
              <CardHeader>
                <CardTitle>Deleted Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                {deletedAccounts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No deleted accounts</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>University/Industry</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deletedAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-medium">{account.name}</TableCell>
                          <TableCell>{account.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{account.type === "company" ? "Company" : "Student"}</Badge>
                          </TableCell>
                          <TableCell>{account.university || account.industry}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" onClick={() => handleRetrieve(account)}>
                              Retrieve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the account for {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewProfile} onOpenChange={setShowViewProfile}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                {selectedUser.university && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">University</Label>
                      <p className="font-medium">{selectedUser.university}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Year</Label>
                      <p className="font-medium">{selectedUser.year}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">CGPA</Label>
                      <p className="font-medium">{selectedUser.cgpa}</p>
                    </div>
                  </>
                )}
                {selectedUser.industry && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">Industry</Label>
                      <p className="font-medium">{selectedUser.industry}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Active Postings</Label>
                      <p className="font-medium">{selectedUser.postings}</p>
                    </div>
                  </>
                )}
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className="bg-green-500">{selectedUser.status}</Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDetails} onOpenChange={setShowEditDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={editFormData.name || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={editFormData.email || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  />
                </div>
                {selectedUser.university && (
                  <>
                    <div>
                      <Label>University</Label>
                      <Input
                        value={editFormData.university || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, university: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        value={editFormData.year || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>CGPA</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={editFormData.cgpa || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, cgpa: Number.parseFloat(e.target.value) })}
                      />
                    </div>
                  </>
                )}
                {selectedUser.industry && (
                  <>
                    <div>
                      <Label>Industry</Label>
                      <Input
                        value={editFormData.industry || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, industry: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDetails(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEditedDetails}>Save Changes</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
