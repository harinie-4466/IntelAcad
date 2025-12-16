"use client"

import type React from "react"

import { StudentHeader } from "@/components/student-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Users, Edit3, TrendingUp, Award, MessageSquare } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function CertificationFeedbackForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);


  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    courseYear?: string
    certificationName?: string
    provider?: string
  }>({})

  const certName = useMemo(() => searchParams.get("cert"), [searchParams])
  const isEdit = useMemo(() => searchParams.get("edit") === "true", [searchParams])

  // Rating states
  const [contentQuality, setContentQuality] = useState(0)
  const [relevance, setRelevance] = useState(0)
  const [support, setSupport] = useState(0)

  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    courseYear: "3rd Year CSE",
    certificationName: "React Advanced Patterns",
    provider: "",
    completionDate: "",
    duration: "",
    difficultyLevel: "",
    keyLearnings: "",
    suggestions: "",
  })

 useEffect(() => {
  const load = async () => {
    if (certName) {
      setFormData((p) => ({ ...p, certificationName: certName }));
    }

    // if in edit mode, fetch from backend
    if (isEdit && certName) {
      try {
        const res = await fetch(`/api/certificationfeedback?certification=${encodeURIComponent(certName)}`);
        const data = await res.json();
        if (data.success && data.feedback) {
          const fb = data.feedback;
          // populate everything
          setFormData((prev) => ({
            ...prev,
            provider: fb.provider || "",
            completionDate: fb.completionDate || "",
            duration: fb.duration || "",
            difficultyLevel: fb.difficultyLevel || "",
            keyLearnings: fb.keyLearnings || "",
            suggestions: fb.suggestions || "",
            fullName: fb.fullName || prev.fullName,
            email: fb.email || prev.email,
            courseYear: fb.courseYear || prev.courseYear
          }));
          setContentQuality(fb.contentQuality || 0);
          setRelevance(fb.relevance || 0);
          setSupport(fb.support || 0);

          // Save id to use when updating
          setEditingFeedbackId(fb._id);
          setIsEditing(true);
        } else {
          // Not found -> continue in create mode
          console.warn("No cert feedback found for:", certName);
        }
      } catch (err) {
        console.error("Error loading cert feedback:", err);
      }
    }
  };
  load();
}, [certName, isEdit]);


  const validate = () => {
    const next: typeof errors = {}
    if (!formData.fullName.trim()) next.fullName = "Please enter your full name."
    if (!formData.email.trim()) next.email = "Please enter your email address."
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email))
      next.email = "Please enter a valid email (e.g., name@example.com)."
    if (!formData.courseYear.trim()) next.courseYear = "Please enter your course and year."
    if (!formData.certificationName.trim()) next.certificationName = "Please enter the certification name."
    if (!formData.provider.trim()) next.provider = "Please select the provider."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;
  if (contentQuality === 0 || relevance === 0 || support === 0) {
    toast({ title: "Missing ratings", description: "Please provide all star ratings", variant: "destructive" });
    return;
  }

  setIsSubmitting(true);
  try {
    const payload = {
      certificationName: formData.certificationName,
      provider: formData.provider,
      fullName: formData.fullName,
      email: formData.email,
      courseYear: formData.courseYear,
      completionDate: formData.completionDate,
      duration: formData.duration,
      difficultyLevel: formData.difficultyLevel,
      keyLearnings: formData.keyLearnings,
      suggestions: formData.suggestions,
      contentQuality,
      relevance,
      support,
      submittedAt: new Date().toISOString(),
    };

    let res, data;
    if (isEditing && editingFeedbackId) {
      res = await fetch("/api/certificationfeedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingFeedbackId, ...payload }),
      });
      data = await res.json();
    } else {
      res = await fetch("/api/certificationfeedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      data = await res.json();
    }

    if (!data.success) {
      throw new Error(data.message || "Failed to save feedback");
    }

    toast({ title: isEditing ? "Feedback updated" : "Feedback submitted", description: "Saved successfully." });

    // redirect back to hub; include a hash to indicate completed if you want:
  router.push("/student/certifications?feedback=submitted");

  } catch (err: any) {
    toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
  } finally {
    setIsSubmitting(false);
  }
};


  const StarRating = ({ rating, setRating }: { rating: number; setRating: (rating: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                star <= rating
                  ? "text-yellow-500 fill-yellow-500 stroke-yellow-600 stroke-[1.5]"
                  : "text-gray-300 stroke-gray-400 stroke-[1.5]"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-white">
      <StudentHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-slate-800 rounded-2xl p-4">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h1 className="text-6xl font-bold text-slate-900 leading-tight text-balance">Feedback Form</h1>
                <p className="text-xl text-slate-600 leading-relaxed text-pretty">
                  The goal of a feedback form is to gather information that can be used to improve certifications,
                  learning experiences, and help fellow students make informed decisions.
                </p>
              </div>

              <div className="space-y-10">
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-500 rounded-full p-3 mt-1 flex-shrink-0">
                    <Star className="h-6 w-6 text-white fill-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-slate-900">Rate Your Experience</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Use star ratings to quickly assess different aspects of your certification journey.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 rounded-full p-3 mt-1 flex-shrink-0">
                    <Edit3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-slate-900">Share Your Insights</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Provide detailed feedback about what you learned and how it helped your career growth.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-500 rounded-full p-3 mt-1 flex-shrink-0">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-slate-900">Help Others Succeed</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Your feedback helps fellow students make informed decisions about their learning path.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orange-500 rounded-full p-3 mt-1 flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-slate-900">Improve Course Quality</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Your honest feedback helps certification providers enhance their content, teaching methods, and
                      overall learning experience for future students.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-pink-500 rounded-full p-3 mt-1 flex-shrink-0">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-slate-900">Build Learning Community</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Contribute to a supportive learning environment by sharing your experiences, challenges, and
                      success stories with the community.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-emerald-500 rounded-full p-3 mt-1 flex-shrink-0">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-slate-900">Track Your Progress</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Reflect on your learning journey and document your achievements, helping you recognize your growth
                      and plan your next career steps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <Card className="shadow-2xl border-2">
                <CardHeader className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl">
                    {isEditing ? "Edit Your Feedback" : "Certification Feedback"}
                  </CardTitle>
                  <CardDescription className="text-emerald-50">
                    Share your experience to help other students
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => {
                              setFormData({ ...formData, fullName: e.target.value })
                              if (errors.fullName) setErrors((p) => ({ ...p, fullName: undefined }))
                            }}
                            aria-invalid={!!errors.fullName}
                            aria-describedby={errors.fullName ? "fullName-error" : undefined}
                            placeholder="e.g., John Doe"
                          />
                          {errors.fullName && (
                            <p id="fullName-error" className="text-red-600 text-sm mt-1">
                              {errors.fullName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({ ...formData, email: e.target.value })
                              if (errors.email) setErrors((p) => ({ ...p, email: undefined }))
                            }}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "email-error" : undefined}
                            placeholder="name@example.com"
                          />
                          {errors.email && (
                            <p id="email-error" className="text-red-600 text-sm mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="courseYear">Course & Year</Label>
                        <Input
                          id="courseYear"
                          value={formData.courseYear}
                          onChange={(e) => {
                            setFormData({ ...formData, courseYear: e.target.value })
                            if (errors.courseYear) setErrors((p) => ({ ...p, courseYear: undefined }))
                          }}
                          aria-invalid={!!errors.courseYear}
                          aria-describedby={errors.courseYear ? "courseYear-error" : undefined}
                          placeholder="e.g., B.Tech CSE, 3rd Year"
                        />
                        {errors.courseYear && (
                          <p id="courseYear-error" className="text-red-600 text-sm mt-1">
                            {errors.courseYear}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Certification Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Certification Details</h3>
                      <div className="space-y-2">
                        <Label htmlFor="certificationName">Certification Name</Label>
                        <Input
                          id="certificationName"
                          value={formData.certificationName}
                          onChange={(e) => {
                            setFormData({ ...formData, certificationName: e.target.value })
                            if (errors.certificationName) setErrors((p) => ({ ...p, certificationName: undefined }))
                          }}
                          aria-invalid={!!errors.certificationName}
                          aria-describedby={errors.certificationName ? "certificationName-error" : undefined}
                          placeholder="e.g., React Advanced Patterns"
                        />
                        {errors.certificationName && (
                          <p id="certificationName-error" className="text-red-600 text-sm mt-1">
                            {errors.certificationName}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="provider">Provider *</Label>
                          <Select
                            value={formData.provider}
                            onValueChange={(value) => {
                              setFormData({ ...formData, provider: value })
                              if (errors.provider) setErrors((p) => ({ ...p, provider: undefined }))
                            }}
                          >
                            <SelectTrigger
                              aria-invalid={!!errors.provider}
                              aria-describedby={errors.provider ? "provider-error" : undefined}
                            >
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="coursera">Coursera</SelectItem>
                              <SelectItem value="udemy">Udemy</SelectItem>
                              <SelectItem value="nptel">NPTEL</SelectItem>
                              <SelectItem value="edx">edX</SelectItem>
                              <SelectItem value="linkedin">LinkedIn Learning</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.provider && (
                            <p id="provider-error" className="text-red-600 text-sm mt-1">
                              {errors.provider}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="completionDate">Completion Date *</Label>
                          <Input
                            id="completionDate"
                            type="date"
                            value={formData.completionDate}
                            onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (in weeks) *</Label>
                        <Input
                          id="duration"
                          type="number"
                          placeholder="e.g., 8"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Feedback</h3>

                      <div className="space-y-2">
                        <Label>Content Quality *</Label>
                        <StarRating rating={contentQuality} setRating={setContentQuality} />
                      </div>

                      <div className="space-y-2">
                        <Label>Relevance to Career Goals *</Label>
                        <StarRating rating={relevance} setRating={setRelevance} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="difficultyLevel">Difficulty Level *</Label>
                        <Select
                          value={formData.difficultyLevel}
                          onValueChange={(value) => setFormData({ ...formData, difficultyLevel: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="difficult">Difficult</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Support & Guidance Received *</Label>
                        <StarRating rating={support} setRating={setSupport} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="keyLearnings">Key Learnings (what did you gain?) *</Label>
                        <Textarea
                          id="keyLearnings"
                          placeholder="Describe the main skills and knowledge you acquired..."
                          value={formData.keyLearnings}
                          onChange={(e) => setFormData({ ...formData, keyLearnings: e.target.value })}
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="suggestions">Suggestions for Improvement</Label>
                        <Textarea
                          id="suggestions"
                          placeholder="Any suggestions to make this certification better..."
                          value={formData.suggestions}
                          onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
                          rows={4}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/student/certifications?feedback=submitted")}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        {isSubmitting ? "Submitting..." : isEditing ? "Update Feedback" : "Submit Feedback"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
