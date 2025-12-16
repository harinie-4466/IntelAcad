"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { analyzeResume, type ATSAnalysisResult } from "@/lib/ats-checker"

export function ATSChecker() {
  const [file, setFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]

    if (!validTypes.includes(uploadedFile.type)) {
      setError("Please upload a PDF, DOCX, or TXT file")
      return
    }

    setFile(uploadedFile)
    setError(null)
    setIsAnalyzing(true)

    try {
      // Read file content
      const text = await readFileContent(uploadedFile)

      // Analyze the resume
      const result = analyzeResume(text)
      setAnalysis(result)
    } catch (err) {
      setError("Failed to analyze resume. Please try again.")
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        resolve(text)
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Improvement"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      case "low":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "medium":
        return <Info className="h-5 w-5 text-yellow-600" />
      case "low":
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ATS Resume Checker</h2>
        <p className="text-gray-600 mb-8">
          Upload your resume to check its compatibility with Applicant Tracking Systems
        </p>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-cyan-500 transition-colors">
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-gray-500">PDF, DOCX, or TXT (Max 5MB)</p>
              </label>
            </div>

            {error && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {isAnalyzing && (
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Analyzing your resume...</p>
                <Progress value={66} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {analysis && (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overall Score */}
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Overall ATS Score</h3>
                <div className={`text-6xl font-bold ${getScoreColor(analysis.score.total)} mb-2`}>
                  {analysis.score.total}
                  <span className="text-2xl">/100</span>
                </div>
                <p className={`text-xl font-medium ${getScoreColor(analysis.score.total)}`}>
                  {getScoreLabel(analysis.score.total)}
                </p>
              </div>

              <Progress value={analysis.score.total} className="h-3 mb-6" />

              {/* Score Breakdown */}
              <div className="grid md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {analysis.score.breakdown.formatting}
                    <span className="text-sm text-gray-500">/20</span>
                  </div>
                  <p className="text-sm text-gray-600">Formatting</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {analysis.score.breakdown.sections}
                    <span className="text-sm text-gray-500">/25</span>
                  </div>
                  <p className="text-sm text-gray-600">Sections</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {analysis.score.breakdown.contact}
                    <span className="text-sm text-gray-500">/15</span>
                  </div>
                  <p className="text-sm text-gray-600">Contact Info</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {analysis.score.breakdown.keywords}
                    <span className="text-sm text-gray-500">/25</span>
                  </div>
                  <p className="text-sm text-gray-600">Keywords</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {analysis.score.breakdown.readability}
                    <span className="text-sm text-gray-500">/15</span>
                  </div>
                  <p className="text-sm text-gray-600">Readability</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Suggestions for Improvement ({analysis.suggestions.length})
            </h3>
            <div className="space-y-4">
              {analysis.suggestions.map((suggestion, index) => (
                <Card key={index} className={`border-2 ${getPriorityColor(suggestion.priority)}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">{getPriorityIcon(suggestion.priority)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{suggestion.category}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              suggestion.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : suggestion.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {suggestion.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-medium">Issue:</span> {suggestion.issue}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Suggestion:</span> {suggestion.suggestion}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {analysis.suggestions.length === 0 && (
                <Card className="border-2 border-green-200 bg-green-50">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-green-900 mb-2">Great Job!</h4>
                    <p className="text-green-700">Your resume looks excellent and is well-optimized for ATS systems.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <Card className="bg-cyan-50 border-cyan-200">
            <CardContent className="p-6">
              <h4 className="font-semibold text-cyan-900 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                ATS Tips
              </h4>
              <ul className="space-y-2 text-sm text-cyan-800">
                <li className="flex gap-2">
                  <span className="text-cyan-600">•</span>
                  <span>Use standard section headings like "Work Experience" and "Education"</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-600">•</span>
                  <span>Avoid headers, footers, tables, and text boxes</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-600">•</span>
                  <span>Use common fonts like Arial, Calibri, or Times New Roman</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-600">•</span>
                  <span>Include relevant keywords from the job description</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-600">•</span>
                  <span>Save your resume as a .docx or .pdf file</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
