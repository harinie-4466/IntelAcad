"use client"

import { useState } from "react"

import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, ImageIcon, Video, Eye, Edit, Trash2, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"

const uploadedContent = [
  {
    id: 1,
    title: "Platform Guidelines 2024",
    type: "PDF",
    audience: "All Users",
    published: "2024-01-05",
    views: 342,
    status: "Published",
  },
  {
    id: 2,
    title: "Welcome Banner",
    type: "Image",
    audience: "Students",
    published: "2024-01-03",
    views: 1245,
    status: "Published",
  },
]

export default function ContentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [contentTitle, setContentTitle] = useState("")
  const [contentDescription, setContentDescription] = useState("")
  const [contentList, setContentList] = useState(uploadedContent)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredContent, setFilteredContent] = useState(uploadedContent)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const titleParam = searchParams.get("title")
    const descriptionParam = searchParams.get("description")

    if (titleParam) {
      setContentTitle(decodeURIComponent(titleParam))
    }
    if (descriptionParam) {
      setContentDescription(decodeURIComponent(descriptionParam))
    }
  }, [searchParams])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = contentList.filter(
      (content) =>
        content.title.toLowerCase().includes(query.toLowerCase()) ||
        content.type.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredContent(filtered)
  }

  const handleView = (content: any) => {
    setSelectedContent(content)
  }

  const handleUpdate = (updatedTitle: string) => {
    if (selectedContent) {
      const updated = contentList.map((c) => (c.id === selectedContent.id ? { ...c, title: updatedTitle } : c))
      setContentList(updated)
      setFilteredContent(updated)
      toast.success("Content updated successfully!")
    }
  }

  const handleDelete = (contentId: number) => {
    const updated = contentList.filter((c) => c.id !== contentId)
    setContentList(updated)
    setFilteredContent(updated)
    toast.success("Content deleted successfully!")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      toast.success(`File "${file.name}" uploaded successfully!`)
    }
  }

  const handlePublishContent = () => {
    const newErrors: { [key: string]: string } = {}

    if (!contentTitle.trim()) {
      newErrors.title = "Title is required"
    }
    if (!uploadedFile) {
      newErrors.file = "Please upload a file"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error("Please fill in all required fields")
      return
    }

    setErrors({})
    const newContent = {
      id: contentList.length + 1,
      title: contentTitle,
      type: uploadedFile.name.split(".").pop()?.toUpperCase() || "FILE",
      audience: "All Users",
      published: new Date().toISOString().split("T")[0],
      views: 0,
      status: "Published",
    }

    setContentList([...contentList, newContent])
    setFilteredContent([...contentList, newContent])
    toast.success("Content published successfully!")
    setContentTitle("")
    setContentDescription("")
    setUploadedFile(null)
  }

  const handleSaveAsDraft = () => {
    const newErrors: { [key: string]: string } = {}

    if (!contentTitle.trim()) {
      newErrors.title = "Title is required to save draft"
    }
    if (!contentDescription.trim()) {
      newErrors.description = "Description is required to save draft"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error("Please fill in required fields")
      return
    }

    setErrors({})
    const drafts = JSON.parse(localStorage.getItem("contentDrafts") || "[]")
    drafts.push({
      id: Date.now(),
      title: contentTitle,
      description: contentDescription,
      savedAt: new Date().toISOString(),
    })
    localStorage.setItem("contentDrafts", JSON.stringify(drafts))

    // Clear form after saving
    setContentTitle("")
    setContentDescription("")
    setUploadedFile(null)

    toast.success("Draft saved successfully!", {
      description: "Your content has been saved to drafts",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Content Management</h1>
            <p className="text-muted-foreground">Upload and manage platform content and resources</p>
          </div>
          <Button variant="outline" onClick={() => (window.location.href = "/admin/content/drafts")}>
            View Drafts
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Upload New Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="content-title">Content Title *</Label>
                <Input
                  id="content-title"
                  placeholder="Enter content title..."
                  value={contentTitle}
                  onChange={(e) => {
                    setContentTitle(e.target.value)
                    setErrors({ ...errors, title: "" })
                  }}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select>
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="resource">Resource Document</SelectItem>
                    <SelectItem value="policy">Policy Document</SelectItem>
                    <SelectItem value="banner">Banner Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the content..."
                  className={`min-h-24 ${errors.description ? "border-red-500" : ""}`}
                  value={contentDescription}
                  onChange={(e) => {
                    setContentDescription(e.target.value)
                    setErrors({ ...errors, description: "" })
                  }}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-cyan-600 transition-colors cursor-pointer ${errors.file ? "border-red-500" : ""}`}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => {
                    handleFileUpload(e)
                    setErrors({ ...errors, file: "" })
                  }}
                  accept=".pdf,.docx,.png,.jpg,.jpeg,.mp4"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop your file here, or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports PDF, DOCX, PNG, JPG, MP4 (Max 50MB)</p>
                  {uploadedFile && (
                    <p className="text-sm font-medium text-cyan-600 mt-2">Selected: {uploadedFile.name}</p>
                  )}
                </label>
              </div>
              {errors.file && <p className="text-xs text-red-500">{errors.file}</p>}

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Select>
                    <SelectTrigger id="audience">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="students">Students Only</SelectItem>
                      <SelectItem value="companies">Companies Only</SelectItem>
                      <SelectItem value="cohort">Specific Cohort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select>
                    <SelectTrigger id="visibility">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="resources">Resources Page</SelectItem>
                      <SelectItem value="popup">Popup on Login</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={handlePublishContent}>
                  <Upload className="h-4 w-4 mr-2" />
                  Publish Content
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={handleSaveAsDraft}>
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cyan-600" />
                  <div>
                    <span className="text-sm font-medium">Policy Documents</span>
                    <p className="text-xs text-muted-foreground">Guidelines, Terms</p>
                  </div>
                </div>
                <span className="font-bold">12</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-purple-600" />
                  <div>
                    <span className="text-sm font-medium">Marketing Assets</span>
                    <p className="text-xs text-muted-foreground">Banners, Logos</p>
                  </div>
                </div>
                <span className="font-bold">8</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-orange-600" />
                  <div>
                    <span className="text-sm font-medium">Tutorial Videos</span>
                    <p className="text-xs text-muted-foreground">How-to Guides</p>
                  </div>
                </div>
                <span className="font-bold">3</span>
              </div>
              <div className="p-3 border rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground mb-1">Total Storage Used</div>
                <div className="text-2xl font-bold text-cyan-600">2.4 GB</div>
                <div className="text-xs text-muted-foreground mt-1">of 10 GB available</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Uploaded Content</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  className="pl-10 text-white placeholder:text-gray-400"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium">{content.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{content.type}</Badge>
                    </TableCell>
                    <TableCell>{content.audience}</TableCell>
                    <TableCell>{content.published}</TableCell>
                    <TableCell>{content.views}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">{content.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleView(content)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>View Content</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Title</Label>
                                <p className="text-sm mt-1">{content.title}</p>
                              </div>
                              <div>
                                <Label>Type</Label>
                                <p className="text-sm mt-1">{content.type}</p>
                              </div>
                              <div>
                                <Label>Audience</Label>
                                <p className="text-sm mt-1">{content.audience}</p>
                              </div>
                              <div>
                                <Label>Views</Label>
                                <p className="text-sm mt-1">{content.views}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Content</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                  defaultValue={content.title}
                                  onChange={(e) => setSelectedContent({ ...content, title: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Audience</Label>
                                <Select defaultValue={content.audience.toLowerCase().replace(" ", "-")}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all-users">All Users</SelectItem>
                                    <SelectItem value="students">Students</SelectItem>
                                    <SelectItem value="companies">Companies</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button
                                className="w-full"
                                onClick={() => handleUpdate(selectedContent?.title || content.title)}
                              >
                                Save Changes
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Content</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                Are you sure you want to delete "{content.title}"? This action cannot be undone.
                              </p>
                              <div className="flex gap-3">
                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() => handleDelete(content.id)}
                                >
                                  Delete
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
