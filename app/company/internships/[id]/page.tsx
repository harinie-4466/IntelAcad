"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Bookmark } from "lucide-react"
import Image from "next/image"

interface Internship {
  id: string
  companyName: string
  companyWebsite: string
  companyLocation: string
  hrName: string
  hrEmail: string
  hrMobile: string
  city: string
  internshipTitle: string
  description: string
  skills: string[]
  duration: string
  durationUnit: string
  positions: string
  deadline: string
  deadlineType: string
  selectionProcess: string[]
  stipendType: string
  stipendAmount?: string
  eligibility: string
  perks: string
  createdAt: string
}

export default function InternshipDetails() {
  const params = useParams()
  const router = useRouter()
  const [internship, setInternship] = useState<Internship | null>(null)

useEffect(() => {
  const fetchInternship = async () => {
    try {
      const res = await fetch(`/api/postings?id=${params.id}`);
      const data = await res.json();

      if (data.success && data.posting) {
        const p = data.posting;

        const formatted: Internship = {
          id: p._id,
          companyName: p.companyName,
          companyWebsite: p.companyWebsite,
          companyLocation: p.companyLocation,
          hrName: p.hrName,
          hrEmail: p.hrEmail,
          hrMobile: p.hrMobile,
          city: p.city,
          internshipTitle: p.internshipTitle,
          description: p.description,
          skills: p.skills || [],
          duration: p.duration,
          durationUnit: p.durationUnit,
          positions: p.positions,
          deadline: p.deadline,
          deadlineType: p.deadlineType,
          selectionProcess: p.selectionProcess || [],
          stipendType: p.stipendType,
          stipendAmount: p.stipendAmount,
          eligibility: p.eligibility,
          perks: p.perks,
          createdAt: p.createdAt,
        };

        setInternship(formatted);
      } else {
        console.warn("Internship not found:", data.message);
        router.push("/company/internships");
      }
    } catch (err) {
      console.error("Error fetching internship:", err);
      router.push("/company/internships");
    }
  };

  if (params.id) fetchInternship();
}, [params.id, router]);


  if (!internship) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading internship details...</p>
        </div>
      </div>
    )
  }

  // Calculate posted time
  const postedDate = new Date(internship.createdAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - postedDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const postedText =
    diffDays === 0 ? "Posted today" : diffDays === 1 ? "Posted 1 day ago" : `Posted ${diffDays} days ago`

  // Generate mock applicant data for chart
  const generateApplicantData = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      applicants: Math.floor(Math.random() * 50) + 10,
    }))
  }

  const applicantData = generateApplicantData()
  const maxApplicants = Math.max(...applicantData.map((d) => d.applicants))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/company/internships"
          className="inline-flex items-center gap-2 text-cyan-800 hover:text-cyan-900 mb-4 sm:mb-6 font-medium text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to My Internships
        </Link>

        <Card className="shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-cyan-800 text-white p-4 sm:p-6 lg:p-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">{internship.internshipTitle}</h1>
          </div>

          <CardContent className="p-4 sm:p-6 lg:p-8">
            {/* Company Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
                  <Image src="/intelacad-logo.png" alt="IntelAcad" width={48} height={48} className="object-contain" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{internship.companyName}</h2>
                  {internship.companyWebsite && (
                    <a
                      href={internship.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base text-cyan-800 hover:underline"
                    >
                      {internship.companyWebsite}
                    </a>
                  )}
                </div>
              </div>
              <span className="text-sm sm:text-base text-gray-600">{postedText}</span>
            </div>

            {/* Internship Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Internship Details</h3>
                <div className="space-y-2 text-sm sm:text-base">
                  <div>
                    <span className="font-semibold text-gray-700">Role:</span>
                    <p className="text-gray-600">{internship.internshipTitle}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Company:</span>
                    <p className="text-gray-600">{internship.companyName}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Type:</span>
                    <p className="text-gray-600">
                      {internship.city}, {internship.companyLocation}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Duration:</span>
                    <p className="text-gray-600">
                      {internship.duration} {internship.durationUnit}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Application Deadline:</span>
                    <p className="text-gray-600">
                      {internship.deadline} {internship.deadlineType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Points */}
              <div>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-600">
                  <li>Build the future with our dev team</li>
                  <li>Hands-on experience with real-world projects</li>
                  <li>Mentorship from industry experts</li>
                  <li>Opportunity for full-time conversion</li>
                </ul>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-sm sm:text-base text-gray-600 text-sm leading-relaxed">{internship.description}</p>
            </div>

            {/* Required Skills */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(internship.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-800 text-white rounded-lg text-xs sm:text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Stipend & Positions */}
            <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-gray-900">Stipend:</span>
                <span className="ml-2 text-gray-600">
                  {internship.stipendAmount
                    ? `${internship.stipendAmount} (${internship.stipendType})`
                    : internship.stipendType}
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-900">Number of Positions:</span>
                <span className="ml-2 text-gray-600">{internship.positions}</span>
              </div>
            </div>

            {/* Required Criteria */}
            {internship.eligibility && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Required Criteria</h3>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-gray-600">
                  {internship.eligibility.split("\n").map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Selection Process */}
            {internship.selectionProcess && internship.selectionProcess.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Eligibility Criteria</h3>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-gray-600">
                  {internship.selectionProcess.map((process, i) => (
                    <li key={i}>{process}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Information */}
            {internship.perks && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Additional Information</h3>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-gray-600">
                  {internship.perks.split(",").map((perk, i) => (
                    <li key={i}>{perk.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Registrations Chart */}
            <div className="mb-6 sm:mb-8 pb-8 border-b">
              <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">Registrations per Week</h3>
              <div className="flex items-end gap-1 h-24">
                {applicantData.map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-cyan-800 rounded-t transition-all hover:bg-cyan-900"
                      style={{ height: `${(data.applicants / maxApplicants) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">Registrations per Week</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 bg-cyan-800 hover:bg-cyan-900 text-white py-4 sm:py-6 text-base sm:text-lg font-semibold">
                Apply Now
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-2 border-cyan-800 text-cyan-800 hover:bg-cyan-50 py-4 sm:py-6 text-base sm:text-lg font-semibold bg-transparent"
                onClick={() => router.push("/company/dashboard")}
              >
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Save for Later
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
