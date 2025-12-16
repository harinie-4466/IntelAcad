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

export default function InternshipFeedbackForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);


  const internshipName = useMemo(() => searchParams.get("internship"), [searchParams])
  const isEdit = useMemo(() => searchParams.get("edit") === "true", [searchParams])

  // Rating states
  const [overallExperience, setOverallExperience] = useState(0)
  const [relevance, setRelevance] = useState(0)
  const [mentorSupport, setMentorSupport] = useState(0)

  // Skill improvement checkboxes
  const [skillsImproved, setSkillsImproved] = useState<string[]>([])

  const skillOptions = [
    "Communication",
    "Coding",
    "Project Management",
    "Research",
    "Problem Solving",
    "Teamwork",
    "Leadership",
    "Time Management",
  ]

  // Form data
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    courseYear: "3rd Year CSE",
    companyName: "",
    internshipRole: "",
    duration: "",
    internshipType: "",
    challengesFaced: "",
    keyTakeaways: "",
    recommend: "",
  })

  // Inline error state
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    courseYear?: string
    internshipRole?: string
  }>({})

 useEffect(() => {
  const loadFeedback = async () => {
    if (internshipName) {
      setFormData((prev) => ({ ...prev, internshipRole: internshipName }));
    }

    // 🔹 Only run if user is editing feedback
    if (isEdit && internshipName) {
      try {
        setIsEditing(true);

        const res = await fetch(`/api/internshipfeedback?internship=${encodeURIComponent(internshipName)}`);
        const data = await res.json();

        if (data.success && data.feedback) {
          const fb = data.feedback;

          // populate main fields
          setFormData((prev) => ({
            ...prev,
            internshipRole: fb.internshipRole || internshipName,
            companyName: fb.companyName || "",
            fullName: fb.fullName || "",
            email: fb.email || "",
            courseYear: fb.courseYear || "",
            duration: fb.duration || "",
            internshipType: fb.internshipType || "",
            challengesFaced: fb.challengesFaced || "",
            keyTakeaways: fb.keyTakeaways || "",
            recommend: fb.recommend || "",
          }));

          // populate ratings and skills
          setOverallExperience(fb.overallExperience || 0);
          setRelevance(fb.relevance || 0);
          setMentorSupport(fb.mentorSupport || 0);
          setSkillsImproved(fb.skillsImproved || []);

          // ✅ Save MongoDB document ID for editing later
          setEditingFeedbackId(fb._id);
        }
      } catch (err) {
        console.error("Error loading feedback:", err);
      }
    }
  };

  loadFeedback();
}, [internshipName, isEdit]);


  const validate = () => {
    const next: typeof errors = {}
    if (!formData.fullName.trim()) next.fullName = "Please enter your full name."
    if (!formData.email.trim()) next.email = "Please enter your email address."
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email))
      next.email = "Please enter a valid email (e.g., name@example.com)."
    if (!formData.courseYear.trim()) next.courseYear = "Please enter your course and year."
    if (!formData.internshipRole.trim()) next.internshipRole = "Please enter the internship role."
    setErrors(next)
    return Object.keys(next).length === 0
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validate()) return;

  if (
    !formData.companyName ||
    !formData.duration ||
    !formData.internshipType ||
    !formData.challengesFaced ||
    !formData.keyTakeaways ||
    !formData.recommend
  ) {
    toast({
      title: "Missing information",
      description: "Please fill in all required fields",
      variant: "destructive",
    });
    return;
  }

  if (overallExperience === 0 || relevance === 0 || mentorSupport === 0) {
    toast({
      title: "Missing ratings",
      description: "Please provide ratings for all categories",
      variant: "destructive",
    });
    return;
  }

  if (skillsImproved.length === 0) {
    toast({
      title: "Skills required",
      description: "Please select at least one skill that improved",
      variant: "destructive",
    });
    return;
  }

  setIsSubmitting(true);

  try {
    // Build payload to send to MongoDB
    const payload = {
      internshipRole: formData.internshipRole || internshipName,
      companyName: formData.companyName,
      fullName: formData.fullName,
      email: formData.email,
      courseYear: formData.courseYear,
      duration: formData.duration,
      internshipType: formData.internshipType,
      challengesFaced: formData.challengesFaced,
      keyTakeaways: formData.keyTakeaways,
      recommend: formData.recommend,
      overallExperience,
      relevance,
      mentorSupport,
      skillsImproved,
      submittedAt: new Date().toISOString(),
    };

    let res;
    let data;

    if (isEditing && editingFeedbackId) {
      // PATCH existing feedback
      res = await fetch("/api/internshipfeedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingFeedbackId, ...payload }),
      });
    } else {
      // POST new feedback
      res = await fetch("/api/internshipfeedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to submit feedback");
    }

    // Save internship name locally for Completed tab visual update (optional)
    if (internshipName) {
      localStorage.setItem("lastFeedbackInternship", internshipName);
    }

    toast({
      title: isEditing ? "Feedback updated!" : "Feedback submitted!",
      description: "Your internship feedback has been saved successfully.",
    });

   // ✅ Correct redirect after successful save
console.log("✅ Redirecting to completed tab after feedback save...");
router.push("/student/internships#completed");


  } catch (err: any) {
    toast({
      title: "Error submitting feedback",
      description: err.message || "Something went wrong.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  const handleCancel = () => {
     router.push("/student/internships#completed");

  }

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

  const toggleSkill = (skill: string) => {
    setSkillsImproved((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-white">
      <StudentHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left Content Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-slate-800 rounded-2xl p-4">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h1 className="text-6xl font-bold text-slate-900 leading-tight text-balance">Feedback Form</h1>
                <p className="text-xl text-slate-600 leading-relaxed text-pretty">
                  The goal of a feedback form is to gather information that can be used to improve internships, learning
                  experiences, and help fellow students make informed decisions.
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
                      Use star ratings to quickly assess different aspects of your internship journey.
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
                      Your feedback helps fellow students make informed decisions about their internship path.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orange-500 rounded-full p-3 mt-1 flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-slate-900">Improve Internship Quality</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Your honest feedback helps companies enhance their internship programs, mentorship, and overall
                      experience for future interns.
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
                      Reflect on your internship journey and document your achievements, helping you recognize your
                      growth and plan your next career steps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Section */}
            <div className="lg:col-span-3">
              <Card className="shadow-2xl border-2">
                <CardHeader className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl">{isEditing ? "Edit Your Feedback" : "Internship Feedback"}</CardTitle>
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

                    {/* Internship Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Internship Details</h3>
                      <div className="space-y-2">
                        <Label htmlFor="internshipRole">Internship Role</Label>
                        <Input
                          id="internshipRole"
                          value={formData.internshipRole}
                          onChange={(e) => {
                            setFormData({ ...formData, internshipRole: e.target.value })
                            if (errors.internshipRole) setErrors((p) => ({ ...p, internshipRole: undefined }))
                          }}
                          aria-invalid={!!errors.internshipRole}
                          aria-describedby={errors.internshipRole ? "internshipRole-error" : undefined}
                          placeholder="e.g., Software Engineering Intern"
                        />
                        {errors.internshipRole && (
                          <p id="internshipRole-error" className="text-red-600 text-sm mt-1">
                            {errors.internshipRole}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            placeholder="Enter company name"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">Duration (in months) *</Label>
                          <Input
                            id="duration"
                            type="number"
                            placeholder="e.g., 3"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="internshipType">Internship Type *</Label>
                        <Select
                          value={formData.internshipType}
                          onValueChange={(value) => setFormData({ ...formData, internshipType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="onsite">On-site</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Feedback</h3>

                      <div className="space-y-2">
                        <Label>Overall Experience *</Label>
                        <StarRating rating={overallExperience} setRating={setOverallExperience} />
                      </div>

                      <div className="space-y-2">
                        <Label>Relevance to Career Goals *</Label>
                        <StarRating rating={relevance} setRating={setRelevance} />
                      </div>

                      <div className="space-y-2">
                        <Label>Mentor Support & Guidance *</Label>
                        <StarRating rating={mentorSupport} setRating={setMentorSupport} />
                      </div>

                      <div className="space-y-2">
                        <Label>Skills Improved (select all that apply) *</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {skillOptions.map((skill) => (
                            <div key={skill} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={skill}
                                checked={skillsImproved.includes(skill)}
                                onChange={() => toggleSkill(skill)}
                                className="rounded border-gray-300"
                              />
                              <Label htmlFor={skill} className="font-normal cursor-pointer">
                                {skill}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="challengesFaced">Challenges Faced *</Label>
                        <Textarea
                          id="challengesFaced"
                          placeholder="Describe the main challenges you encountered..."
                          value={formData.challengesFaced}
                          onChange={(e) => setFormData({ ...formData, challengesFaced: e.target.value })}
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="keyTakeaways">Key Takeaways *</Label>
                        <Textarea
                          id="keyTakeaways"
                          placeholder="What did you learn from this internship..."
                          value={formData.keyTakeaways}
                          onChange={(e) => setFormData({ ...formData, keyTakeaways: e.target.value })}
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recommend">Would you recommend this internship? *</Label>
                        <Select
                          value={formData.recommend}
                          onValueChange={(value) => setFormData({ ...formData, recommend: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select recommendation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes, definitely</SelectItem>
                            <SelectItem value="maybe">Maybe, with reservations</SelectItem>
                            <SelectItem value="no">No, not recommended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="flex-1 bg-transparent"
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
