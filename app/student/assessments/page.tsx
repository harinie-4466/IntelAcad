"use client"

import { useState } from "react"
import { StudentHeader } from "@/components/student-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ExternalLink,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Upload,
  MoreVertical,
  Bookmark,
  Share2,
  Flag,
  Play,
  Download,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Clock,
  FileText,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

interface Assessment {
  id: string
  title: string
  platform: string
  platformLogo: string
  description: string
  duration: string
  difficulty: "Easy" | "Medium" | "Hard"
  participants: number
  domain: string
  topics: string[]
  nextDate?: string
  isCompleted?: boolean
  externalLink?: string
  image?: string // Added image property
}

export default function DiscoverAssessments() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [recordModalOpen, setRecordModalOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [topPicksIndex, setTopPicksIndex] = useState(0)
  const [trendingIndex, setTrendingIndex] = useState(0)
  const [completedAssessments, setCompletedAssessments] = useState<string[]>([])
  const { toast } = useToast()

  useState(() => {
    const stored = localStorage.getItem("completedAssessments")
    if (stored) {
      const parsed = JSON.parse(stored)
      setCompletedAssessments(parsed.map((a: any) => a.id))
    }
  })

  const topPicks: Assessment[] = [
    {
      id: "1",
      title: "LeetCode Weekly Contest",
      platform: "LeetCode",
      platformLogo: "/images/leetcode-contest-logo.png",
      description: "Weekly competitive programming contest with 4 algorithmic problems",
      duration: "90 min",
      difficulty: "Medium",
      participants: 15000,
      domain: "Programming",
      topics: ["DSA", "Algorithms"],
      nextDate: "Every Sunday",
      externalLink: "https://leetcode.com/contest/",
      image: "/images/leetcode-contest-logo.png",
    },
    {
      id: "2",
      title: "HackerRank Skills Certification",
      platform: "HackerRank",
      platformLogo: "/hackerrank1.png",
      description: "Get certified in various programming languages and problem-solving",
      duration: "120 min",
      difficulty: "Medium",
      participants: 50000,
      domain: "Programming",
      topics: ["Problem Solving", "Certification"],
      externalLink: "https://www.hackerrank.com/skills-verification",
      image: "/hackerrank1.png",
    },
    {
      id: "3",
      title: "Codeforces Round",
      platform: "Codeforces",
      platformLogo: "/images/codeforces-logo.png",
      description: "Competitive programming rounds with rating system",
      duration: "120 min",
      difficulty: "Hard",
      participants: 20000,
      domain: "Programming",
      topics: ["Competitive Programming", "Algorithms"],
      externalLink: "https://codeforces.com/contests",
      image: "/images/codeforces-logo.png",
    },
    {
      id: "4",
      title: "Kaggle Competition",
      platform: "Kaggle",
      platformLogo: "/images/kaggle-logo.png",
      description: "Data science and machine learning competitions with real datasets",
      duration: "Varies",
      difficulty: "Medium",
      participants: 10000,
      domain: "Data Science",
      topics: ["ML", "Data Analysis"],
      externalLink: "https://www.kaggle.com/competitions",
      image: "/images/kaggle-logo.png",
    },
    {
      id: "5",
      title: "CodeChef Starters",
      platform: "CodeChef",
      platformLogo: "/images/codechef-logo.png",
      description: "Weekly coding contest for beginners and intermediates",
      duration: "120 min",
      difficulty: "Easy",
      participants: 12000,
      domain: "Programming",
      topics: ["DSA", "Problem Solving"],
      externalLink: "https://www.codechef.com/contests",
      image: "/codechef.jpeg",
    },
    {
      id: "6",
      title: "AtCoder Beginner Contest",
      platform: "AtCoder",
      platformLogo: "/atcoder.jpeg",
      description: "Weekly programming contest with 6-8 problems",
      duration: "100 min",
      difficulty: "Easy",
      participants: 8000,
      domain: "Programming",
      topics: ["Algorithms", "DSA"],
      externalLink: "https://atcoder.jp/contests/",
      image: "/atcoder.jpeg",
    },
    {
      id: "7",
      title: "TopCoder SRM",
      platform: "TopCoder",
      platformLogo: "/images/topcoder-logo.png",
      description: "Single Round Match competitive programming",
      duration: "95 min",
      difficulty: "Hard",
      participants: 5000,
      domain: "Programming",
      topics: ["Competitive Programming"],
      externalLink: "https://www.topcoder.com/community/competitive-programming",
      image: "/topcoder.jpeg",
    },
    {
      id: "8",
      title: "Google Kickstart",
      platform: "Google",
      platformLogo: "/images/google-kickstart-logo.png",
      description: "Practice rounds for competitive programming",
      duration: "180 min",
      difficulty: "Hard",
      participants: 25000,
      domain: "Programming",
      topics: ["Algorithms", "Problem Solving"],
      externalLink: "https://www.geeksforgeeks.org/blogs/google-kick-start-important-dates-eligibility-contest-details/",
      image: "/kickstart.png",
    },
  ]

  const featuredAssessments: Assessment[] = [
    {
      id: "5",
      title: "Google Code Jam",
      platform: "Google",
      platformLogo: "/codejam.jpeg",
      description: "Annual international programming competition hosted by Google",
      duration: "180 min",
      difficulty: "Hard",
      participants: 50000,
      domain: "Programming",
      topics: ["Algorithms", "Problem Solving"],
      nextDate: "March 2025",
    },
    {
      id: "6",
      title: "Meta Hacker Cup",
      platform: "Meta",
      platformLogo: "/hackercup.jpeg",
      description: "Facebook's annual worldwide programming competition",
      duration: "180 min",
      difficulty: "Hard",
      participants: 30000,
      domain: "Programming",
      topics: ["Algorithms", "Competitive Programming"],
    },
  ]

  const partners = [
    { name: "LeetCode", logo: "/leetcode.jpg" },
    { name: "HackerRank", logo: "/hackerrank.jpg" },
    { name: "Codeforces", logo: "/codeforces.jpg" },
    { name: "Kaggle", logo: "/kaggle.jpg" },
    { name: "HackerEarth", logo: "/hackerearth.jpg" },
    { name: "TopCoder", logo: "/topcoder.jpg" },
  ]

  const trendingContests: Assessment[] = [
    {
      id: "t1",
      title: "Google Kickstart Round",
      platform: "Google",
      platformLogo: "/kickstart.png",
      description: "Practice rounds for competitive programming",
      duration: "180 min",
      difficulty: "Hard",
      participants: 25000,
      domain: "Programming",
      topics: ["Algorithms", "Problem Solving"],
    },
    {
      id: "t2",
      title: "AtCoder Beginner Contest",
      platform: "AtCoder",
      platformLogo: "/atcoder.jpeg",
      description: "Weekly programming contest for beginners",
      duration: "100 min",
      difficulty: "Easy",
      participants: 8000,
      domain: "Programming",
      topics: ["DSA", "Algorithms"],
    },
    {
      id: "t3",
      title: "CodeChef Long Challenge",
      platform: "CodeChef",
      platformLogo: "/codechef.jpeg",
      description: "10-day long programming challenge",
      duration: "10 days",
      difficulty: "Medium",
      participants: 15000,
      domain: "Programming",
      topics: ["Algorithms", "Problem Solving"],
    },
    {
      id: "t4",
      title: "Topcoder SRM",
      platform: "TopCoder",
      platformLogo: "/topcoder.jpeg",
      description: "Single Round Match competitive programming",
      duration: "95 min",
      difficulty: "Hard",
      participants: 5000,
      domain: "Programming",
      topics: ["Competitive Programming"],
    },
  ]

  const domainAssessments = {
    APTITUDE: [
      {
        id: "apt1",
        title: "Quantitative Aptitude Test",
        platform: "IndiaBix",
        platformLogo: "/indiabix-logo.png",
        description: "Practice numerical reasoning and quantitative aptitude",
        duration: "60 min",
        difficulty: "Medium" as const,
        participants: 50000,
        domain: "APTITUDE",
        topics: ["Numerical", "Reasoning"],
        image: "/ap1.jpeg",
        externalLink: "https://www.indiabix.com/aptitude/questions-and-answers/",
      },
      {
        id: "apt2",
        title: "Logical Reasoning Challenge",
        platform: "Testbook",
        platformLogo: "/testbook-logo.png",
        description: "Test your logical and analytical reasoning skills",
        duration: "45 min",
        difficulty: "Medium" as const,
        participants: 35000,
        domain: "APTITUDE",
        topics: ["Logic", "Reasoning"],
        image: "/ap2.jpeg",
        externalLink: "https://testbook.com/question-answer/logical-reasoning-quiz",
      },
      {
        id: "apt4",
        title: "Data Interpretation Skills",
        platform: "byjus",
        platformLogo: "/byjus-logo.png",
        description: "Practice analyzing charts, graphs, and tables",
        duration: "40 min",
        difficulty: "Easy" as const,
        participants: 45000,
        domain: "APTITUDE",
        topics: ["Data Analysis", "Charts", "Graphs"],
        image: "/ap4.jpeg",
        externalLink: "https://byjus.com/data-interpretation-questions-and-answers/",
      },
    ],
    DSA: [
      {
        id: "dsa1",
        title: "Data Structures Mastery",
        platform: "GeeksforGeeks",
        platformLogo: "/gfg-logo.png",
        description: "Comprehensive DSA practice problems",
        duration: "120 min",
        difficulty: "Medium" as const,
        participants: 40000,
        domain: "DSA",
        topics: ["DSA", "Algorithms"],
        image: "/dsa1.png",
        externalLink: "https://www.geeksforgeeks.org/data-structures/",
      },
      {
        id: "dsa2",
        title: "Algorithm Analysis Practice",
        platform: "LeetCode",
        platformLogo: "/leetcode.jpg",
        description: "Analyze time and space complexity of algorithms",
        duration: "90 min",
        difficulty: "Hard" as const,
        participants: 30000,
        domain: "DSA",
        topics: ["Algorithms", "Complexity Analysis"],
        image: "/dsa2.jpeg",
        externalLink: "https://leetcode.com/problemset/algorithms/",
      },
      {
        id: "dsa3",
        title: "Dynamic Programming Challenges",
        platform: "Codeforces",
        platformLogo: "/codeforces.jpg",
        description: "Solve challenging DP problems",
        duration: "150 min",
        difficulty: "Hard" as const,
        participants: 25000,
        domain: "DSA",
        topics: ["DP", "Algorithms"],
        image: "/dsa3.jpeg",
        externalLink: "https://codeforces.com/problemset?tags=105",
      },
      {
        id: "dsa4",
        title: "Graph Theory Problems",
        platform: "HackerRank",
        platformLogo: "/hackerrank.jpg",
        description: "Practice problems related to graph traversal and algorithms",
        duration: "100 min",
        difficulty: "Medium" as const,
        participants: 35000,
        domain: "DSA",
        topics: ["Graphs", "Algorithms"],
        image: "/dsa4.png",
        externalLink: "https://www.hackerrank.com/domains/graph",
      },
      {
        id: "dsa5",
        title: "Tree Traversal Practice",
        platform: "CodeChef",
        platformLogo: "/codechef-logo.png",
        description: "Focus on various tree data structures and traversals",
        duration: "110 min",
        difficulty: "Medium" as const,
        participants: 28000,
        domain: "DSA",
        topics: ["Trees", "DSA"],
        image: "/dsa5.jpeg",
        externalLink: "https://www.codechef.com/practice/modules/rec-fun-java",
      },
            {
        id: "dsa6",
        title: "Design Patterns in Practice",
        platform: "Pluralsight",
        platformLogo: "/pluralsight-logo.png",
        description: "Learn and apply common design patterns",
        duration: "110 min",
        difficulty: "Hard" as const,
        participants: 15000,
        domain: "DSA",
        topics: ["Design Patterns", "Software Architecture"],
        image: "/oop5.jpeg",
        externalLink: "https://www.pluralsight.com/courses/design-patterns-java",
      },
    ],
    OOPS: [
      {
        id: "oop1",
        title: "Object-Oriented Design Principles",
        platform: "Educative",
        platformLogo: "/educative-logo.png",
        description: "Learn SOLID principles and design patterns",
        duration: "90 min",
        difficulty: "Medium" as const,
        participants: 20000,
        domain: "OOPS",
        topics: ["OOP", "Design Patterns", "SOLID"],
        image: "/oop1.jpeg",
        externalLink: "https://www.educative.io/courses/grokking-the-object-oriented-programming-interview",
      },
      {
        id: "oop2",
        title: "Java OOP Concepts",
        platform: "Coursera",
        platformLogo: "/coursera-logo.png",
        description: "Deep dive into Java's object-oriented features",
        duration: "120 min",
        difficulty: "Medium" as const,
        participants: 18000,
        domain: "OOPS",
        topics: ["Java", "OOP"],
        image: "/oop2.png",
        externalLink: "https://www.coursera.org/learn/java-programming",
      },
      {
        id: "oop3",
        title: "C++ OOP Fundamentals",
        platform: "Udemy",
        platformLogo: "/udemy-logo.png",
        description: "Master object-oriented programming in C++",
        duration: "150 min",
        difficulty: "Hard" as const,
        participants: 22000,
        domain: "OOPS",
        topics: ["C++", "OOP"],
        image: "/oop3.png",
        externalLink: "https://www.udemy.com/course/object-oriented-programming-in-c/",
      },
      {
        id: "oop4",
        title: "Python OOP Practices",
        platform: "Real Python",
        platformLogo: "/realpython-logo.png",
        description: "Explore Python's approach to object-oriented programming",
        duration: "100 min",
        difficulty: "Medium" as const,
        participants: 28000,
        domain: "OOPS",
        topics: ["Python", "OOP"],
        image: "/oop4.jpeg",
        externalLink: "https://realpython.com/python-classes/",
      },
    ],
    OS: [
      {
        id: "os1",
        title: "Operating Systems Fundamentals",
        platform: "Coursera",
        platformLogo: "/coursera-logo.png",
        description: "Test your OS concepts knowledge",
        duration: "75 min",
        difficulty: "Hard" as const,
        participants: 15000,
        domain: "OS",
        topics: ["OS", "Systems"],
        image: "/os1.jpeg",
        externalLink: "https://www.coursera.org/learn/operating-systems",
      },
      {
        id: "os2",
        title: "Linux Command Line Practice",
        platform: "Linux Foundation",
        platformLogo: "/linuxfoundation-logo.png",
        description: "Master essential Linux commands",
        duration: "60 min",
        difficulty: "Medium" as const,
        participants: 25000,
        domain: "OS",
        topics: ["Linux", "CLI", "Systems"],
        image: "/os2.png",
        externalLink: "https://training.linuxfoundation.org/training/introduction-to-linux-lfcs/",
      },
      {
        id: "os3",
        title: "Concurrency and Deadlocks",
        platform: "edX",
        platformLogo: "/edx-logo.png",
        description: "Understand OS concurrency issues",
        duration: "90 min",
        difficulty: "Hard" as const,
        participants: 12000,
        domain: "OS",
        topics: ["Concurrency", "Deadlocks", "Systems"],
        image: "/os3.png",
        externalLink: "https://www.edx.org/learn/operating-systems",
      },
      {
        id: "os4",
        title: "Memory Management Quiz",
        platform: "Udacity",
        platformLogo: "/udacity-logo.png",
        description: "Test your knowledge of memory management techniques",
        duration: "50 min",
        difficulty: "Medium" as const,
        participants: 18000,
        domain: "OS",
        topics: ["Memory Management", "OS"],
        image: "/os4.png",
        externalLink: "https://www.udacity.com/course/intro-to-operating-systems--cs330",
      },
      {
        id: "os5",
        title: "Process Scheduling Algorithms",
        platform: "MIT OpenCourseware",
        platformLogo: "/mit-logo.png",
        description: "Explore various process scheduling techniques",
        duration: "70 min",
        difficulty: "Hard" as const,
        participants: 10000,
        domain: "OS",
        topics: ["Process Scheduling", "OS"],
        image: "/os5.png",
        externalLink:
          "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-033-computer-system-engineering-fall-2015/",
      },
    ],
    DBMS: [
      {
        id: "db1",
        title: "Database Management Quiz",
        platform: "W3Schools",
        platformLogo: "/w3schools-logo.png",
        description: "SQL and database concepts assessment",
        duration: "60 min",
        difficulty: "Medium" as const,
        participants: 30000,
        domain: "DBMS",
        topics: ["SQL", "DBMS"],
        image: "/dbms1.jpeg",
        externalLink: "https://www.w3schools.com/sql/sql_quiz.asp",
      },
      {
        id: "db2",
        title: "SQL Query Practice",
        platform: "SQLZoo",
        platformLogo: "/sqlzoo-logo.png",
        description: "Interactive SQL tutorials and exercises",
        duration: "90 min",
        difficulty: "Medium" as const,
        participants: 40000,
        domain: "DBMS",
        topics: ["SQL", "Queries"],
        image: "/dbms2.png",
        externalLink: "https://sqlzoo.net/",
      },
      {
        id: "db3",
        title: "NoSQL Fundamentals",
        platform: "MongoDB University",
        platformLogo: "/mongodb-logo.png",
        description: "Introduction to NoSQL databases like MongoDB",
        duration: "120 min",
        difficulty: "Medium" as const,
        participants: 25000,
        domain: "DBMS",
        topics: ["NoSQL", "MongoDB", "Databases"],
        image: "/dbms3.png",
        externalLink: "https://university.mongodb.com/courses/M001",
      },
      {
        id: "db4",
        title: "Database Normalization",
        platform: "Khan Academy",
        platformLogo: "/khanacademy-logo.png",
        description: "Understand database normalization forms",
        duration: "70 min",
        difficulty: "Easy" as const,
        participants: 35000,
        domain: "DBMS",
        topics: ["Normalization", "Databases"],
        image: "/dbms4.jpeg",
        externalLink: "https://www.khanacademy.org/computing/computer-programming/sql/sql-databases/a/normalization",
      },
      {
        id: "db5",
        title: "Database Design Principles",
        platform: "Coursera",
        platformLogo: "/coursera-logo.png",
        description: "Learn the fundamentals of effective database design",
        duration: "100 min",
        difficulty: "Hard" as const,
        participants: 18000,
        domain: "DBMS",
        topics: ["Database Design", "ER Diagrams"],
        image: "/dbms5.png",
        externalLink: "https://www.coursera.org/learn/database-design",
      },
    ],
  }

  const prepVideos = [
    {
      title: "How to Prepare for Coding Interviews",
      channel: "Tech Interview Pro",
      duration: "15:30",
      thumbnail: "/codinground.jpeg",
      views: "250K",
      url: "https://www.youtube.com/watch?v=FNL61tvwBUg", // Rickroll for placeholder
    },
    {
      title: "Aptitude Test Strategies",
      channel: "Career Guidance",
      duration: "12:45",
      thumbnail: "/teststrategies.jpeg",
      views: "180K",
      url: "https://www.youtube.com/watch?v=dxt6IzqU4Wg", // Rickroll for placeholder
    },
    {
      title: "Time Management in Competitive Programming",
      channel: "CodeForces",
      duration: "10:20",
      thumbnail: "/time.jpeg",
      views: "120K",
      url: "https://www.youtube.com/watch?v=xpvhwilGZgg", // Rickroll for placeholder
    },
  ]

  const leaderboard = [
    { rank: 1, name: "Rahul Sharma", tests: 156, avatar: "/avatar-1.png" },
    { rank: 2, name: "Priya Patel", tests: 142, avatar: "/avatar-2.png" },
    { rank: 3, name: "Amit Kumar", tests: 138, avatar: "/avatar-3.png" },
    { rank: 4, name: "Sneha Reddy", tests: 125, avatar: "/avatar-4.png" },
    { rank: 5, name: "Vikram Singh", tests: 118, avatar: "/avatar-5.png" },
  ]

  const cheatsheets = [
    {
      title: "DSA Cheatsheet",
      description: "Complete data structures and algorithms reference",
      topics: ["Arrays", "Trees", "Graphs", "DP"],
      downloadUrl: "#",
      icon: "/dsa-icon.png",
    },
    {
      title: "Aptitude Formulas",
      description: "All important formulas for quantitative aptitude",
      topics: ["Time & Work", "Probability", "Percentages"],
      downloadUrl: "#",
      icon: "/aptitude-icon.png",
    },
    {
      title: "SQL Commands",
      description: "Essential SQL queries and commands",
      topics: ["SELECT", "JOIN", "Aggregation"],
      downloadUrl: "#",
      icon: "/sql-icon.png",
    },
    {
      title: "OOP Concepts",
      description: "Object-oriented programming principles",
      topics: ["Inheritance", "Polymorphism", "Encapsulation"],
      downloadUrl: "#",
      icon: "/oop-icon.png",
    },
  ]

  const faqs = [
    {
      question: "How do I record my completed assessments?",
      answer:
        "Click the 'Record' button on any assessment card after completing it. You can add your score, notes, and even upload proof of completion.",
    },
    {
      question: "Are these assessments free?",
      answer:
        "Most assessments on partner platforms are free. Some premium contests may require registration fees, which will be clearly indicated.",
    },
    {
      question: "How often should I practice?",
      answer:
        "We recommend completing at least 3-4 assessments per week and 12-15 per month for consistent improvement.",
    },
    {
      question: "Can I filter assessments by difficulty?",
      answer: "Yes! Use the filters at the top of the page to sort by difficulty, domain, platform, and more.",
    },
    {
      question: "What is the leaderboard based on?",
      answer:
        "The leaderboard ranks users based on the total number of assessments completed. It updates in real-time as you record more completions.",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "Medium":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleRecordCompletion = (assessment: Assessment) => {
    setSelectedAssessment(assessment)
    setRecordModalOpen(true)
  }

  const handleSaveCompletion = () => {
    if (selectedAssessment) {
      const completions = JSON.parse(localStorage.getItem("completedAssessments") || "[]")
      completions.push({
        ...selectedAssessment,
        completedDate: new Date().toISOString(),
      })
      localStorage.setItem("completedAssessments", JSON.stringify(completions))
      setCompletedAssessments([...completedAssessments, selectedAssessment.id])
      setRecordModalOpen(false)

      toast({
        title: "Success!",
        description: "Assessment moved to completed assessments",
      })
    }
  }

  const filterAssessments = (assessments: Assessment[]) => {
    let filtered = assessments.filter((assessment) => {
      // Filter out completed assessments from main page
      if (completedAssessments.includes(assessment.id)) {
        return false
      }

      const matchesSearch =
        searchQuery === "" ||
        assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assessment.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assessment.domain.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDifficulty = selectedDifficulty === "all" || assessment.difficulty === selectedDifficulty

      return matchesSearch && matchesDifficulty
    })

    // If a domain is selected, prioritize those cards first
    if (selectedDomain !== "all") {
      const domainMatches = filtered.filter((a) => a.domain === selectedDomain)
      const others = filtered.filter((a) => a.domain !== selectedDomain)
      filtered = [...domainMatches, ...others]
    }

    return filtered
  }

  const scrollTopPicks = (direction: "left" | "right") => {
    if (direction === "left") {
      setTopPicksIndex(Math.max(0, topPicksIndex - 1))
    } else {
      setTopPicksIndex(Math.min(topPicks.length - 4, topPicksIndex + 1))
    }
  }

  const scrollTrending = (direction: "left" | "right") => {
    if (direction === "left") {
      setTrendingIndex(Math.max(0, trendingIndex - 1))
    } else {
      setTrendingIndex(Math.min(trendingContests.length - 4, trendingIndex + 1))
    }
  }

  const handleDownloadCheatsheet = (title: string) => {
    // Create a dummy PDF blob
    const pdfContent = `Cheatsheet: ${title}\n\nThis is a dummy cheatsheet for demonstration purposes.`
    const blob = new Blob([pdfContent], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/\s+/g, "-")}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded!",
      description: `${title} has been downloaded`,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StudentHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 py-16 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Test Your Knowledge. Track Your Progress. Ace the Real Thing.
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Curated external challenges, competitions, and timed assessments—handpicked for growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-cyan-600 hover:bg-cyan-700"
                onClick={() => document.getElementById("top-picks")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore Top Picks
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/student/assessments/completed">View My Completed Assessments</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/student/assessments/success-stories">
                  <Award className="h-4 w-4 mr-2" />
                  Success Stories
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="bg-white border-b py-6 px-4 sticky top-16 z-40">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by challenge, platform, or skill"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Practice by Domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Domains</SelectItem>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="APTITUDE">APTITUDE</SelectItem>
                  <SelectItem value="DBMS">DBMS</SelectItem>
                  <SelectItem value="DSA">DSA</SelectItem>
                  <SelectItem value="OOPS">OOPS</SelectItem>
                  <SelectItem value="OS">OS</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Top Picks Carousel */}
        <section className="py-12 px-4" id="top-picks">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Top Picks</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollTopPicks("left")}
                  disabled={topPicksIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollTopPicks("right")}
                  disabled={topPicksIndex >= topPicks.length - 4}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filterAssessments(topPicks)
                .slice(topPicksIndex, topPicksIndex + 4)
                .map((assessment) => (
                  <Card
                    key={assessment.id}
                    className={`hover:shadow-lg transition-shadow ${
                      completedAssessments.includes(assessment.id) ? "border-l-4 border-l-green-500" : ""
                    }`}
                  >
                    {assessment.image && (
                      <div className="relative h-32 w-full overflow-hidden rounded-t-lg">
                        <Image
                          src={assessment.image || "/placeholder.svg"}
                          alt={assessment.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <Image
                          src={assessment.platformLogo || "/placeholder.svg"}
                          alt={assessment.platform}
                          width={32}
                          height={32}
                          className="rounded"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Bookmark className="h-4 w-4 mr-2" />
                              Save for later
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Flag className="h-4 w-4 mr-2" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{assessment.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {completedAssessments.includes(assessment.id) && (
                          <Badge className="bg-green-100 text-green-800 w-full justify-center">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                          <span>{assessment.duration}</span>
                          <span>•</span>
                          <span>{assessment.participants.toLocaleString()} participants</span>
                          {assessment.nextDate && (
                            <>
                              <span>•</span>
                              <span>{assessment.nextDate}</span>
                            </>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={getDifficultyColor(assessment.difficulty)}>
                            {assessment.difficulty}
                          </Badge>
                          <Badge variant="outline">{assessment.domain}</Badge>
                          {assessment.topics.map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1" asChild>
                            <a href={assessment.externalLink || "#"} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Open
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => handleRecordCompletion(assessment)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Record
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                <TrendingUp className="inline h-6 w-6 mr-2 text-cyan-600" />
                Trending Contests
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollTrending("left")}
                  disabled={trendingIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollTrending("right")}
                  disabled={trendingIndex >= trendingContests.length - 4}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingContests.slice(trendingIndex, trendingIndex + 4).map((contest) => (
                <Card key={contest.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Image
                        src={contest.platformLogo || "/placeholder.svg"}
                        alt={contest.platform}
                        width={32}
                        height={32}
                        className="rounded"
                      />
                      <Badge className="bg-orange-100 text-orange-800">Trending</Badge>
                    </div>
                    <CardTitle className="text-lg">{contest.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{contest.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                        <span>{contest.duration}</span>
                        <span>•</span>
                        <span>{contest.participants.toLocaleString()} participants</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={getDifficultyColor(contest.difficulty)}>
                          {contest.difficulty}
                        </Badge>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1" asChild>
                          <a href="#" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Open
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => handleRecordCompletion(contest)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Record
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Practice by Domain</h2>
            <div className="space-y-8">
              {Object.entries(domainAssessments).map(([domain, assessments]) => (
                <div key={domain}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 capitalize">{domain}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assessments.map((assessment) => (
                      <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                        <Image
                          src={assessment.image || "/placeholder.svg"}
                          alt={assessment.title}
                          width={350}
                          height={150}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3 mb-2">
                            <Image
                              src={assessment.platformLogo || "/placeholder.svg"}
                              alt={assessment.platform}
                              width={32}
                              height={32}
                              className="rounded"
                            />
                            <div className="flex-1">
                              <CardTitle className="text-base">{assessment.title}</CardTitle>
                              <p className="text-xs text-gray-600">{assessment.platform}</p>
                            </div>
                          </div>
                          <CardDescription className="text-sm">{assessment.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {completedAssessments.includes(assessment.id) && (
                              <Badge className="bg-green-100 text-green-800 w-full justify-center mb-2">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Clock className="h-3 w-3" />
                              <span>{assessment.duration}</span>
                              <span>•</span>
                              <Badge variant="outline" className={getDifficultyColor(assessment.difficulty)}>
                                {assessment.difficulty}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1" asChild>
                                <a href={assessment.externalLink} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Open
                                </a>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-transparent"
                                onClick={() => handleRecordCompletion(assessment)}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Record
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured / Trending */}
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Competitions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredAssessments.map((assessment) => (
                <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Image
                        src={assessment.platformLogo || "/placeholder.svg"}
                        alt={assessment.platform}
                        width={48}
                        height={48}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{assessment.title}</CardTitle>
                        <CardDescription>{assessment.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-cyan-600">{assessment.duration}</div>
                          <div className="text-xs text-gray-600">Duration</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-cyan-600">
                            {(assessment.participants / 1000).toFixed(0)}K
                          </div>
                          <div className="text-xs text-gray-600">Participants</div>
                        </div>
                        <div>
                          <Badge className={getDifficultyColor(assessment.difficulty)}>{assessment.difficulty}</Badge>
                          <div className="text-xs text-gray-600 mt-1">Difficulty</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" asChild>
                          <a href="#" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Challenge
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => handleRecordCompletion(assessment)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Record Completion
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Preparation Videos */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Preparation Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {prepVideos.map((video, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => window.open(video.url, "_blank")}
                >
                  <div className="relative">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      width={350}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-all">
                      <div className="bg-white rounded-full p-4 group-hover:scale-110 transition-transform">
                        <Play className="h-8 w-8 text-cyan-800" />
                      </div>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white">{video.duration}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{video.channel}</p>
                    <p className="text-xs text-gray-500">{video.views} views</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-gradient-to-br from-cyan-50 to-blue-50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <Award className="h-12 w-12 mx-auto mb-4 text-cyan-600" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Performers</h2>
              <p className="text-gray-600">Users who have completed the most assessments</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {leaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center gap-4 p-4 rounded-lg bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100 text-cyan-800 font-bold">
                        {user.rank}
                      </div>
                      <Image
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.tests} tests completed</p>
                      </div>
                      {user.rank <= 3 && (
                        <Badge
                          className={
                            user.rank === 1
                              ? "bg-yellow-100 text-yellow-800"
                              : user.rank === 2
                                ? "bg-gray-100 text-gray-800"
                                : "bg-orange-100 text-orange-800"
                          }
                        >
                          {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : "🥉"}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Practice with IntelAcad?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Target className="h-12 w-12 mx-auto mb-4 text-cyan-600" />
                  <h3 className="font-bold text-lg mb-2">Curated Challenges</h3>
                  <p className="text-sm text-gray-600">
                    Handpicked assessments from top platforms to ensure quality practice
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-cyan-600" />
                  <h3 className="font-bold text-lg mb-2">Track Progress</h3>
                  <p className="text-sm text-gray-600">Record completions and monitor your improvement over time</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Award className="h-12 w-12 mx-auto mb-4 text-cyan-600" />
                  <h3 className="font-bold text-lg mb-2">Compete & Learn</h3>
                  <p className="text-sm text-gray-600">Join the leaderboard and learn from top performers</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Regular Practice Matters</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-bold mb-2">Build Confidence</h3>
                  <p className="text-sm text-gray-600">
                    Regular practice reduces anxiety and builds confidence for real interviews and exams
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-bold mb-2">Identify Weak Areas</h3>
                  <p className="text-sm text-gray-600">
                    Discover your strengths and weaknesses to focus your study efforts effectively
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-bold mb-2">Time Management</h3>
                  <p className="text-sm text-gray-600">
                    Learn to manage time effectively under pressure, a crucial skill for competitive exams
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-bold mb-2">Stay Updated</h3>
                  <p className="text-sm text-gray-600">
                    Keep up with latest patterns and trends in technical assessments and interviews
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Download Free Cheatsheets</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {cheatsheets.map((sheet, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 mx-auto mb-3 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-8 w-8 text-cyan-600" />
                      </div>
                      <h3 className="font-bold mb-2">{sheet.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{sheet.description}</p>
                      <div className="flex flex-wrap gap-1 justify-center mb-4">
                        {sheet.topics.map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-transparent"
                      variant="outline"
                      onClick={() => handleDownloadCheatsheet(sheet.title)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Suggested Practice Strategy</h2>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-6">
                  <h3 className="text-4xl font-bold mb-2">3-4</h3>
                  <p className="text-cyan-100">Assessments per week</p>
                  <p className="text-sm text-cyan-200 mt-2">Maintain consistent practice without burnout</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-6">
                  <h3 className="text-4xl font-bold mb-2">12-15</h3>
                  <p className="text-cyan-100">Assessments per month</p>
                  <p className="text-sm text-cyan-200 mt-2">Build strong foundation and track progress</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Partner Marquee */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <h3 className="text-center text-sm font-semibold text-gray-600 mb-8">TRUSTED PLATFORMS</h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {partners.map((partner) => (
                <div
                  key={partner.name}
                  className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
                >
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    width={120}
                    height={40}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-cyan-600 to-blue-600 py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Practice Journey?</h2>
            <p className="text-cyan-100 mb-8 text-lg">Track your progress and build an impressive record</p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/student/assessments/completed">View My Completed Assessments</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Record Completion Modal */}
      <Dialog open={recordModalOpen} onOpenChange={setRecordModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Completion</DialogTitle>
            <DialogDescription>Track your progress by recording this completed assessment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Assessment</Label>
              <Input value={selectedAssessment?.title || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Platform</Label>
              <Input value={selectedAssessment?.platform || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Completion Date</Label>
              <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="space-y-2">
              <Label>Score (Optional)</Label>
              <Input placeholder="e.g., 85/100 or 4/4 problems" />
            </div>
            <div className="space-y-2">
              <Label>Time Taken (Optional)</Label>
              <Input placeholder="e.g., 45 minutes" />
            </div>
            <div className="space-y-2">
              <Label>Rank/Percentile (Optional)</Label>
              <Input placeholder="e.g., Rank 150 or Top 10%" />
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Add any notes about your experience, what you learned, areas to improve..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Upload Proof (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-cyan-500 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 5MB</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRecordModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCompletion} className="bg-cyan-600 hover:bg-cyan-700">
              Save Completion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
