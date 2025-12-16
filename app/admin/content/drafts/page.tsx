"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function DraftsPage() {
  const router = useRouter()
  const [drafts, setDrafts] = useState<any[]>([])

  useEffect(() => {
    const savedDrafts = JSON.parse(localStorage.getItem("contentDrafts") || "[]")
    setDrafts(savedDrafts)
  }, [])

  const handleDelete = (id: number) => {
    const updated = drafts.filter((d) => d.id !== id)
    setDrafts(updated)
    localStorage.setItem("contentDrafts", JSON.stringify(updated))
    toast.success("Draft deleted successfully!")
  }

  const handlePublish = (draft: any) => {
    const publishedContent = JSON.parse(localStorage.getItem("publishedContent") || "[]")
    const newContent = {
      ...draft,
      id: Date.now(),
      publishedAt: new Date().toISOString(),
      status: "published",
    }
    publishedContent.push(newContent)
    localStorage.setItem("publishedContent", JSON.stringify(publishedContent))

    toast.success(`"${draft.title}" published successfully!`)
    handleDelete(draft.id)
  }

  const handleEdit = (draft: any) => {
    const params = new URLSearchParams()
    params.set("title", draft.title)
    params.set("description", draft.description || "")
    params.set("draftId", draft.id.toString())
    router.push(`/admin/content?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content
          </Button>
          <h1 className="text-3xl font-bold mb-2">Saved Drafts</h1>
          <p className="text-muted-foreground">Manage your unpublished content drafts</p>
        </div>

        {drafts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No saved drafts</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {drafts.map((draft) => (
              <Card key={draft.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{draft.title}</h3>
                        <Badge variant="secondary">Draft</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{draft.description}</p>
                      <p className="text-xs text-muted-foreground">Saved: {new Date(draft.savedAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(draft)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" onClick={() => handlePublish(draft)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Publish
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(draft.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
