"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Users, Calendar, Eye, Save, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"

const sentNotifications = [
  {
    id: 1,
    title: "New Internship Opportunities Available",
    recipients: "All Students",
    channels: ["Email", "In-App"],
    sent: "2024-01-08 10:30 AM",
    delivered: 1245,
    opened: 892,
    clicked: 456,
  },
  {
    id: 2,
    title: "Platform Maintenance Notice",
    recipients: "All Users",
    channels: ["Email", "In-App"],
    sent: "2024-01-07 3:00 PM",
    delivered: 1332,
    opened: 1105,
    clicked: 234,
  },
]

const savedTemplates = [
  {
    id: 1,
    name: "Welcome Email",
    description: "Standard welcome message for new users",
    lastModified: "2024-01-05",
  },
  {
    id: 2,
    name: "Internship Alert",
    description: "Template for new internship postings",
    lastModified: "2024-01-03",
  },
  {
    id: 3,
    name: "Maintenance Notice",
    description: "System maintenance notification template",
    lastModified: "2024-01-01",
  },
]

export default function NotificationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [sentNotificationsList, setSentNotificationsList] = useState<any[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const prefilledTitle = searchParams.get("title")
    const prefilledMessage = searchParams.get("message")
    if (prefilledTitle) setTitle(decodeURIComponent(prefilledTitle))
    if (prefilledMessage) setMessage(decodeURIComponent(prefilledMessage))
  }, [searchParams])

  useEffect(() => {
    const stored = localStorage.getItem("sentNotifications")
    if (stored) {
      setSentNotificationsList(JSON.parse(stored))
    }
  }, [])

  const handleSaveTemplate = () => {
    const newErrors: { [key: string]: string } = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!message.trim()) {
      newErrors.message = "Message is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error("Please fill in all required fields")
      return
    }

    setErrors({})
    const templates = JSON.parse(localStorage.getItem("notificationTemplates") || "[]")
    templates.push({
      id: Date.now(),
      name: title,
      description: message.substring(0, 100),
      title,
      message,
      lastModified: new Date().toISOString().split("T")[0],
    })
    localStorage.setItem("notificationTemplates", JSON.stringify(templates))

    toast.success("Template saved successfully!")
  }

  const handleSend = () => {
    const newErrors: { [key: string]: string } = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!message.trim()) {
      newErrors.message = "Message is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error("Please fill in all required fields")
      return
    }

    setErrors({})
    const newNotification = {
      id: Date.now(),
      title,
      message,
      recipients: "All Students",
      channels: ["Email", "In-App"],
      sent: new Date().toLocaleString(),
      delivered: Math.floor(Math.random() * 1000) + 500,
      opened: Math.floor(Math.random() * 500) + 200,
      clicked: Math.floor(Math.random() * 300) + 100,
    }

    const updatedList = [newNotification, ...sentNotificationsList]
    setSentNotificationsList(updatedList)
    localStorage.setItem("sentNotifications", JSON.stringify(updatedList))

    toast.success("Notification sent successfully!", {
      description: "Your notification has been delivered to all recipients",
    })

    setTitle("")
    setMessage("")
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Notification System</h1>
          <p className="text-muted-foreground">Create and manage platform notifications</p>
        </div>

        <Tabs defaultValue="compose" className="space-y-6">
          <div className="bg-gray-100 -mx-6 px-6 py-4">
            <div className="max-w-7xl mx-auto">
              <TabsList className="bg-transparent w-full justify-start">
                <TabsTrigger value="compose" className="data-[state=active]:bg-white">
                  Compose
                </TabsTrigger>
                <TabsTrigger value="sent" className="data-[state=active]:bg-white">
                  Sent Notifications
                </TabsTrigger>
                <TabsTrigger value="templates" className="data-[state=active]:bg-white">
                  Templates
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="compose">
            <Card>
              <CardHeader>
                <CardTitle>Create New Notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Notification Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter notification title..."
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      setErrors({ ...errors, title: "" })
                    }}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message..."
                    className={`min-h-32 ${errors.message ? "border-red-500" : ""}`}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value)
                      setErrors({ ...errors, message: "" })
                    }}
                  />
                  {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Recipients</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-students">All Students</SelectItem>
                        <SelectItem value="all-companies">All Companies</SelectItem>
                        <SelectItem value="all-users">All Users</SelectItem>
                        <SelectItem value="specific-cohort">Specific Cohort</SelectItem>
                        <SelectItem value="custom">Custom List</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Delivery Channels</Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="in-app" defaultChecked />
                      <label
                        htmlFor="in-app"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        In-App Notification
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email" defaultChecked />
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sms" />
                      <label
                        htmlFor="sms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        SMS (if configured)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Schedule</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="send-now" defaultChecked />
                      <label htmlFor="send-now" className="text-sm font-medium">
                        Send Immediately
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="schedule" />
                      <label htmlFor="schedule" className="text-sm font-medium">
                        Schedule for Later
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1" onClick={handleSend}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Notification
                  </Button>
                  <Dialog open={showPreview} onOpenChange={setShowPreview}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1 bg-transparent" onClick={handlePreview}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Notification Preview</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-muted">
                          <h3 className="font-semibold text-lg mb-2">{title || "Notification Title"}</h3>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {message || "Your message will appear here..."}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" onClick={handleSaveTemplate}>
                    <Save className="h-4 w-4 mr-2" />
                    Save as Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            {sentNotificationsList.map((notification) => (
              <Card key={notification.id}>
                <CardContent className="py-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{notification.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {notification.recipients}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {notification.sent}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {notification.channels.map((channel) => (
                        <Badge key={channel} variant="secondary">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-600">{notification.delivered}</div>
                      <div className="text-xs text-muted-foreground">Delivered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{notification.opened}</div>
                      <div className="text-xs text-muted-foreground">
                        Opened ({((notification.opened / notification.delivered) * 100).toFixed(1)}%)
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{notification.clicked}</div>
                      <div className="text-xs text-muted-foreground">
                        Clicked ({((notification.clicked / notification.delivered) * 100).toFixed(1)}%)
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Message
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{notification.title}</DialogTitle>
                        </DialogHeader>
                        <div className="p-4 border rounded-lg bg-muted">
                          <p className="text-sm whitespace-pre-wrap">
                            {notification.message || "This is the notification message content that was sent."}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Saved Templates</h2>
              <Button
                onClick={() => {
                  const tabs = document.querySelector('[role="tablist"]')
                  const composeTab = tabs?.querySelector('[value="compose"]') as HTMLElement
                  composeTab?.click()
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Template
              </Button>
            </div>
            {(() => {
              const templates = JSON.parse(localStorage.getItem("notificationTemplates") || "[]")
              return templates.length > 0
                ? templates.map((template: any) => (
                    <Card key={template.id}>
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                            <p className="text-xs text-muted-foreground">Last modified: {template.lastModified}</p>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{template.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="p-4 border rounded-lg bg-muted">
                                    <h4 className="font-semibold mb-2">Title:</h4>
                                    <p className="text-sm mb-4">{template.title}</p>
                                    <h4 className="font-semibold mb-2">Message:</h4>
                                    <p className="text-sm whitespace-pre-wrap">{template.message}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              onClick={() => {
                                setTitle(template.title)
                                setMessage(template.message)
                                const tabs = document.querySelector('[role="tablist"]')
                                const composeTab = tabs?.querySelector('[value="compose"]') as HTMLElement
                                composeTab?.click()
                                toast.success("Template loaded into compose!")
                              }}
                            >
                              Use Template
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : savedTemplates.map((template) => (
                    <Card key={template.id}>
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                            <p className="text-xs text-muted-foreground">Last modified: {template.lastModified}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button size="sm">Use Template</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
            })()}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
