"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Home, Briefcase, PlusCircle, Users, FileText, LogOut, Info, Search, X, Menu } from "lucide-react"
import Image from "next/image"

interface Internship {
  _id: string
  id: string
  companyName: string
  internshipTitle: string
  companyLocation: string
  city: string
  duration: string
  durationUnit: string
  positions: string
  stipendType: string
  skills: string[]
  createdAt: string
}

export default function MyInternships() {
  const [internships, setInternships] = useState<Internship[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

 useEffect(() => {
  const fetchInternships = async () => {
    try {
      const res = await fetch("/api/postings");
      const data = await res.json();
      if (data.success && Array.isArray(data.postings)) {
        // Map _id -> id so frontend uses `id` consistently
        const formatted = data.postings.map((p: any) => ({
          id: p._id, // important: map Mongo _id to id
          companyName: p.companyName,
          internshipTitle: p.internshipTitle,
          companyLocation: p.companyLocation,
          city: p.city,
          duration: p.duration,
          durationUnit: p.durationUnit,
          positions: p.positions,
          stipendType: p.stipendType,
          skills: p.skills || [],
          createdAt: p.createdAt
        }));

        setInternships(formatted);
        setFilteredInternships(formatted);
      } else {
        console.warn("Failed to load postings", data.message);
      }
    } catch (err) {
      console.error("Error fetching internships:", err);
    }
  };

  fetchInternships();
}, []);


  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredInternships(internships)
    } else {
      const filtered = internships.filter(
        (internship) =>
          internship.internshipTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          internship.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          internship.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredInternships(filtered)
    }
  }, [searchQuery, internships])

  const deleteInternship = async (id: string) => {
  if (!confirm("Are you sure you want to delete this internship?")) return;

  try {
    // send DELETE request with ?id=
    const res = await fetch(`/api/postings?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!data.success) {
      // surface backend message (e.g., "Not found")
      throw new Error(data.message || "Failed to delete internship");
    }

    // remove the card from UI immediately
    setInternships((prev) => prev.filter((internship) => internship.id !== id));
    setFilteredInternships((prev) => prev.filter((internship) => internship.id !== id));

    // optional: show confirmation
    alert("Internship deleted successfully.");
  } catch (err: any) {
    console.error("Error deleting internship:", err);
    alert("Delete failed: " + (err.message || "Unknown error"));
  }
};


  // Generate mock applicant data for visualization
  const generateApplicantData = () => {
    return Array.from({ length: 8 }, (_, i) => ({
      week: i + 1,
      applicants: Math.floor(Math.random() * 50) + 10,
    }))
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-cyan-800 text-white flex-col">
        <div className="p-6 border-b border-cyan-700">
          <Link href="/company" className="flex items-center">
            <Image
              src="/Intelacad.png"
              alt="IntelAcad"
              width={140}
              height={40}
              className="object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/company/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </Link>
          <Link
            href="/company/internships"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-700 transition-colors"
          >
            <Briefcase className="w-5 h-5" />
            <span className="font-medium">Internships</span>
          </Link>
          <Link
            href="/company/create"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="font-medium">Post Internship</span>
          </Link>
          <Link
            href="/company/applicants"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Applicants</span>
          </Link>
          <Link
            href="/company/reports"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-cyan-700">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors w-full text-left">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-cyan-800 text-white rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar - Mobile */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)} />

          {/* Compact Sidebar */}
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-cyan-800 text-white flex flex-col shadow-2xl">
            <div className="p-4 border-b border-cyan-700">
              <Link href="/company" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src="/app/company/internships/Intelacad.png"
                  alt="IntelAcad"
                  width={120}
                  height={32}
                  className="object-contain brightness-0 invert"
                />
              </Link>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              <Link
                href="/company/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Overview</span>
              </Link>
              <Link
                href="/company/internships"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-cyan-700 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Briefcase className="w-4 h-4" />
                <span className="font-medium">Internships</span>
              </Link>
              <Link
                href="/company/create"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusCircle className="w-4 h-4" />
                <span className="font-medium">Post Internship</span>
              </Link>
              <Link
                href="/company/applicants"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="w-4 h-4" />
                <span className="font-medium">Applicants</span>
              </Link>
              <Link
                href="/company/reports"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">Analytics</span>
              </Link>
            </nav>

            <div className="p-3 border-t border-cyan-700">
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-700 transition-colors w-full text-left text-sm">
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">My Internships</h1>
            <Link href="/company/create">
              <Button className="bg-cyan-800 hover:bg-cyan-900 text-white w-full sm:w-auto">
                <PlusCircle className="w-5 h-5 mr-2" />
                Create New Internship
              </Button>
            </Link>
          </div>

          <div className="mb-6">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by title, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>

          {filteredInternships.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {searchQuery ? "No Internships Found" : "No Internships Yet"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : "Create your first internship posting to get started!"}
                </p>
                {!searchQuery && (
                  <Link href="/company/create">
                    <Button className="bg-cyan-800 hover:bg-cyan-900 text-white">Create Internship</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredInternships.map((internship) => {
                const applicantData = generateApplicantData()
                const maxApplicants = Math.max(...applicantData.map((d) => d.applicants))

                return (
                  <Card key={internship.id} className="shadow-lg hover:shadow-xl transition-shadow bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-gray-900 text-sm">{internship.companyName}</span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Info className="w-5 h-5" />
                        </button>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
                        {internship.internshipTitle}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        Build the future with our dev team. Hands-on experience guaranteed.
                      </p>

                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <p className="text-sm font-bold text-gray-900">Stipend: {internship.stipendType}</p>
                          <p className="text-xs text-cyan-800 flex items-center gap-1 mt-1">
                            <Users className="w-3 h-3" />
                            Registrations per week
                          </p>
                        </div>
                        <div className="flex items-end gap-0.5 h-8">
                          {applicantData.map((data, i) => (
                            <div
                              key={i}
                              className="w-1.5 bg-cyan-800 rounded-t"
                              style={{ height: `${(data.applicants / maxApplicants) * 100}%` }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">Applicants</span>
                      </div>

                      <div className="mb-4 text-sm text-gray-600">
                        <p>
                          {internship.duration} {internship.durationUnit} · {internship.positions} positions
                        </p>
                      </div>

                      {internship.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {internship.skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 border-2 border-cyan-800 text-cyan-800 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="space-y-3">
                        <Link href={`/company/internships/${internship.id}`}>
                          <Button className="w-full bg-cyan-800 hover:bg-cyan-900 text-white">View Details</Button>
                        </Link>
                        <div className="flex gap-3">
                          <Link href={`/company/edit/${internship.id}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full border-cyan-800 text-cyan-800 hover:bg-cyan-50 bg-transparent"
                            >
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            onClick={() => deleteInternship(internship.id)}
                            className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
