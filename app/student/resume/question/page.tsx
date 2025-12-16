"use client"

import { useState } from "react"
import { StudentHeader } from "@/components/student-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileUp, FileText, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ResumeQuestion() {
  const router = useRouter()
  const [selected, setSelected] = useState<"upload" | "create" | null>(null)

  const handleContinue = () => {
    if (selected === "upload") {
      router.push("/student/resume/builder?mode=upload")
    } else if (selected === "create") {
      router.push("/student/resume/builder?mode=create")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <StudentHeader />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Let's Build Your Resume</h1>
            <p className="text-xl text-gray-600">Do you already have an existing resume?</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card
              className={`cursor-pointer transition-all hover:shadow-xl ${
                selected === "upload" ? "border-4 border-cyan-800 shadow-lg" : "border-2 hover:border-cyan-600"
              }`}
              onClick={() => setSelected("upload")}
            >
              <CardContent className="p-8 text-center">
                <div className="bg-cyan-100 text-cyan-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileUp className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Yes, I have one</h2>
                <p className="text-gray-600 mb-4">
                  Upload your existing resume and we'll help you improve it with our ATS-optimized templates
                </p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 mt-0.5">✓</span>
                    <span>Auto-fill information from your resume</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 mt-0.5">✓</span>
                    <span>Save time with smart parsing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 mt-0.5">✓</span>
                    <span>Optimize for ATS systems</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:shadow-xl ${
                selected === "create" ? "border-4 border-cyan-800 shadow-lg" : "border-2 hover:border-cyan-600"
              }`}
              onClick={() => setSelected("create")}
            >
              <CardContent className="p-8 text-center">
                <div className="bg-blue-100 text-blue-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">No, start from scratch</h2>
                <p className="text-gray-600 mb-4">
                  Create a professional resume from scratch with our easy-to-use guided form
                </p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Step-by-step guided process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Professional templates included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Expert tips and suggestions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-cyan-800 hover:bg-cyan-700 text-lg px-12 py-6"
              disabled={!selected}
              onClick={handleContinue}
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
