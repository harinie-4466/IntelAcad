"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send, Eye, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"

export default function ComposeNotificationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const templateTitle = searchParams.get("title")
    const templateMessage = searchParams.get("message")
    if (templateTitle) setTitle(templateTitle)
    if (templateMessage) setMessage(templateMessage)
  }, [searchParams])

  const handleSaveTemplate = () => {
    if (!title || !message) {
      toast.error("Please fill in title and message")
      return
    }

    const templates = JSON.parse(localStorage.getItem("notificationTemplates") || "[]")
    templates.push({
      id: Date.now(),
      title,
      message,
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem("notificationTemplates", JSON.stringify(templates))
    toast.success("Template saved successfully!")
    router.push("/admin/notifications")
  }

  const handleSendNotification = () => {
    if (!title || !message) {
      toast.error("Please fill in title and message")
      return
    }

    const sentNotifications = JSON.parse(localStorage.getItem("sentNotifications") || "[]")
    sentNotifications.push({
      id: Date.now(),
      title,
      message,
      sentAt: new Date().toISOString(),
      sentBy: "Admin",
    })
    localStorage.setItem("sentNotifications", JSON.stringify(sentNotifications))
    toast.success("Notification sent successfully!")
    router.push("/admin/notifications")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Compose Notification</h1>
          <p className="text-muted-foreground">Create and send notifications to users</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Notification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                placeholder="Enter notification title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message..."
                className="min-h-32"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
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
                  <label htmlFor="in-app" className="text-sm font-medium">
                    In-App Notification
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="email" defaultChecked />
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sms" />
                  <label htmlFor="sms" className="text-sm font-medium">
                    SMS (if configured)
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleSendNotification}>
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>

              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-transparent">
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
                      <h3 className="font-semibold mb-2">{title || "Notification Title"}</h3>
                      <p className="text-sm text-muted-foreground">{message || "Your message will appear here..."}</p>
                    </div>
                    <Button className="w-full" onClick={() => setShowPreview(false)}>
                      Close Preview
                    </Button>
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
      </main>
    </div>
  )
}
