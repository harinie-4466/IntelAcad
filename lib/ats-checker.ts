// ATS Checker utility functions for analyzing resumes

export interface ATSScore {
  total: number
  breakdown: {
    formatting: number
    keywords: number
    sections: number
    readability: number
    contact: number
  }
}

export interface ATSSuggestion {
  category: string
  issue: string
  suggestion: string
  priority: "high" | "medium" | "low"
}

export interface ATSAnalysisResult {
  score: ATSScore
  suggestions: ATSSuggestion[]
  extractedText: string
}

// Parse PDF file and extract text
export async function parsePDF(file: File): Promise<string> {
  // For frontend parsing, we'll use a simple text extraction
  // In a real implementation, you'd use pdf.js or similar
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string
        // Simple text extraction - in production use pdf.js
        resolve(text)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// Parse DOCX file and extract text
export async function parseDOCX(file: File): Promise<string> {
  // For frontend parsing, we'll use a simple text extraction
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        resolve(text)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// Analyze resume text and calculate ATS score
export function analyzeResume(text: string): ATSAnalysisResult {
  const score: ATSScore = {
    total: 0,
    breakdown: {
      formatting: 0,
      keywords: 0,
      sections: 0,
      readability: 0,
      contact: 0,
    },
  }

  const suggestions: ATSSuggestion[] = []

  // 1. Check formatting (20 points)
  const hasSimpleFormatting = !text.includes("│") && !text.includes("┌") && !text.includes("└")
  const hasNoSpecialChars = !/[★●◆■▪]/.test(text)

  if (hasSimpleFormatting && hasNoSpecialChars) {
    score.breakdown.formatting = 20
  } else {
    score.breakdown.formatting = 10
    suggestions.push({
      category: "Formatting",
      issue: "Complex formatting detected",
      suggestion:
        "Use simple, clean formatting without tables, text boxes, or special characters. ATS systems prefer plain text.",
      priority: "high",
    })
  }

  // 2. Check for essential sections (25 points)
  const sections = {
    contact: /contact|email|phone|address/i.test(text),
    experience: /experience|work history|employment/i.test(text),
    education: /education|degree|university|college/i.test(text),
    skills: /skills|technical skills|competencies/i.test(text),
  }

  const sectionCount = Object.values(sections).filter(Boolean).length
  score.breakdown.sections = Math.round((sectionCount / 4) * 25)

  if (!sections.contact) {
    suggestions.push({
      category: "Sections",
      issue: "Missing contact information section",
      suggestion: "Add a clear contact section with your email, phone number, and location.",
      priority: "high",
    })
  }
  if (!sections.experience) {
    suggestions.push({
      category: "Sections",
      issue: "Missing work experience section",
      suggestion: "Include a work experience or employment history section with your relevant roles.",
      priority: "high",
    })
  }
  if (!sections.education) {
    suggestions.push({
      category: "Sections",
      issue: "Missing education section",
      suggestion: "Add an education section with your degrees and institutions.",
      priority: "medium",
    })
  }
  if (!sections.skills) {
    suggestions.push({
      category: "Sections",
      issue: "Missing skills section",
      suggestion: "Include a skills section highlighting your technical and professional competencies.",
      priority: "medium",
    })
  }

  // 3. Check contact information (15 points)
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)
  const hasPhone = /\+?[\d\s\-()]{10,}/.test(text)

  if (hasEmail && hasPhone) {
    score.breakdown.contact = 15
  } else if (hasEmail || hasPhone) {
    score.breakdown.contact = 8
    suggestions.push({
      category: "Contact",
      issue: "Incomplete contact information",
      suggestion: hasEmail
        ? "Add a phone number to your contact information."
        : "Add an email address to your contact information.",
      priority: "high",
    })
  } else {
    score.breakdown.contact = 0
    suggestions.push({
      category: "Contact",
      issue: "No contact information found",
      suggestion: "Include your email address and phone number prominently at the top of your resume.",
      priority: "high",
    })
  }

  // 4. Check for relevant keywords (25 points)
  const commonKeywords = [
    "managed",
    "developed",
    "created",
    "implemented",
    "designed",
    "led",
    "improved",
    "increased",
    "reduced",
    "achieved",
    "collaborated",
    "analyzed",
    "coordinated",
    "executed",
    "delivered",
  ]

  const keywordCount = commonKeywords.filter((keyword) => new RegExp(keyword, "i").test(text)).length

  score.breakdown.keywords = Math.round((keywordCount / commonKeywords.length) * 25)

  if (score.breakdown.keywords < 15) {
    suggestions.push({
      category: "Keywords",
      issue: "Limited action verbs and keywords",
      suggestion:
        'Use more action verbs like "managed," "developed," "implemented," and "achieved" to describe your accomplishments.',
      priority: "medium",
    })
  }

  // 5. Check readability (15 points)
  const wordCount = text.split(/\s+/).length
  const hasGoodLength = wordCount >= 200 && wordCount <= 800
  const hasBulletPoints = /[•\-*]/.test(text) || /^\s*[\d]+\./.test(text)

  if (hasGoodLength && hasBulletPoints) {
    score.breakdown.readability = 15
  } else if (hasGoodLength || hasBulletPoints) {
    score.breakdown.readability = 8
    if (!hasGoodLength) {
      suggestions.push({
        category: "Readability",
        issue: wordCount < 200 ? "Resume is too short" : "Resume is too long",
        suggestion:
          wordCount < 200
            ? "Expand your resume with more details about your experience and achievements (aim for 200-800 words)."
            : "Condense your resume to focus on the most relevant information (aim for 200-800 words).",
        priority: "medium",
      })
    }
    if (!hasBulletPoints) {
      suggestions.push({
        category: "Readability",
        issue: "No bullet points detected",
        suggestion: "Use bullet points to list your responsibilities and achievements for better readability.",
        priority: "low",
      })
    }
  } else {
    score.breakdown.readability = 5
    suggestions.push({
      category: "Readability",
      issue: "Poor formatting and structure",
      suggestion: "Improve readability by using bullet points and keeping content between 200-800 words.",
      priority: "medium",
    })
  }

  // Calculate total score
  score.total = Object.values(score.breakdown).reduce((sum, val) => sum + val, 0)

  // Add general suggestions based on total score
  if (score.total < 60) {
    suggestions.unshift({
      category: "Overall",
      issue: "Low ATS compatibility score",
      suggestion:
        "Your resume needs significant improvements to pass ATS systems. Focus on the high-priority suggestions first.",
      priority: "high",
    })
  } else if (score.total < 80) {
    suggestions.unshift({
      category: "Overall",
      issue: "Moderate ATS compatibility",
      suggestion:
        "Your resume is decent but could be improved. Address the suggestions below to increase your chances.",
      priority: "medium",
    })
  }

  return {
    score,
    suggestions,
    extractedText: text,
  }
}
