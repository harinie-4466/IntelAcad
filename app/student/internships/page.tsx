"use client"

import { StudentHeader } from "@/components/student-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Heart,
  MapPin,
  Search,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Star,
  Filter,
  Play,
  Award,
  Users,
  Sparkles,
  ExternalLink,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Footer } from "@/components/footer"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function InternshipsHub() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [testimonialSlide, setTestimonialSlide] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [savedInternships, setSavedInternships] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("browse");

  // const [appliedInternships, setAppliedInternships] = useState<number[]>([]) // Removed as per updates
  const [withdrawDialog, setWithdrawDialog] = useState<{
  show: boolean;
  applicationId: string | null;
}>({
  show: false,
  applicationId: null,
});

  const [showAppliedPopup, setShowAppliedPopup] = useState(false)
  const [filters, setFilters] = useState({
    type: [] as string[],
    duration: [] as string[],
    stipend: [] as string[],
  })
  const [myApplications, setMyApplications] = useState<any[]>([])

  const [removeFeedbackDialog, setRemoveFeedbackDialog] = useState<{ show: boolean; internshipId: number | null }>({
    show: false,
    internshipId: null,
  })

useEffect(() => {
  const fetchApplicationsAndFeedback = async () => {
    try {
      // 1️⃣ Fetch internship applications
      const appsRes = await fetch("/api/application");
      const appsData = await appsRes.json();

      if (appsData.success) {
        setMyApplications(appsData.applications);
      } else {
        console.error("Failed to fetch applications:", appsData.message);
      }

      // 2️⃣ Fetch internship feedbacks
      const feedbackRes = await fetch("/api/internshipfeedback");
      const feedbackData = await feedbackRes.json();

      if (feedbackData.success && Array.isArray(feedbackData.feedbacks)) {
        const feedbacks = feedbackData.feedbacks;

        // Update completed/in-progress internships in UI
        setCompletedInternships((prev) =>
          prev.map((internship) => {
            const hasFeedback = feedbacks.some(
              (fb: { internshipRole: string }) => fb.internshipRole === internship.role
            );
            return { ...internship, feedbackProvided: hasFeedback };
          })
        );
      }

      // 3️⃣ Clean up URL (remove ?feedback=submitted)
      // ✅ Detect if user just returned from feedback form
if (window.location.hash === "#completed") {
  console.log("Detected feedback submission — showing completed section");
  
  // You can trigger your UI updates here if needed
  // e.g., refresh applications or completed internships
  
  // ✅ Clean up the URL (remove the hash)
  window.history.replaceState({}, "", window.location.pathname);
}

    } catch (err) {
      console.error("Error loading applications or feedbacks:", err);
    }
  };

  fetchApplicationsAndFeedback();
}, []);

useEffect(() => {
  // Runs only in the browser
  if (typeof window !== "undefined" && window.location.hash === "#completed") {
    setActiveTab("completed");
  } else {
    setActiveTab("browse");
  }
}, []);



  const heroSlides = [
    {
      title: "Join Top Tech Companies",
      subtitle: "Discover internship opportunities at leading tech firms",
      image: "/modern-tech-office-with-diverse-team-collaborating.jpg",
      cta: "Browse Internships",
    },
    {
      title: "Build Your Career",
      subtitle: "Gain real-world experience and industry connections",
      image: "/professional-mentorship-session-in-modern-workspac.jpg",
      cta: "Apply Now",
    },
    {
      title: "Remote & Hybrid Options",
      subtitle: "Find flexible internships that fit your schedule",
      image: "/remote.jpg",
      cta: "Explore Opportunities",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const internships = [
    {
      id: 1,
      title: "Full Stack Developer Intern",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      type: "Remote",
      duration: "3 months",
      stipend: "$2,000/month",
      posted: "2 days ago",
      applicants: 45,
      match: 95,
      logo: "/techcorp-company-logo.jpg",
      description: "Work on cutting-edge web applications using React, Node.js, and cloud technologies.",
      requirements: ["React.js", "Node.js", "MongoDB", "Git"],
    },
    {
      id: 2,
      title: "Machine Learning Intern",
      company: "AI Innovations Inc",
      location: "Boston, MA",
      type: "Hybrid",
      duration: "6 months",
      stipend: "$2,500/month",
      posted: "1 week ago",
      applicants: 78,
      match: 88,
      logo: "/ai-innovations-company-logo.jpg",
      description: "Join our AI research team to develop and deploy machine learning models.",
      requirements: ["Python", "TensorFlow", "Data Analysis", "Statistics"],
    },
    {
      id: 3,
      title: "Mobile App Developer Intern",
      company: "AppVentures",
      location: "Austin, TX",
      type: "On-site",
      duration: "4 months",
      stipend: "$1,800/month",
      posted: "3 days ago",
      applicants: 32,
      match: 82,
      logo: "/appventures-company-logo.jpg",
      description: "Build innovative mobile applications for iOS and Android platforms.",
      requirements: ["React Native", "JavaScript", "Mobile UI/UX", "REST APIs"],
    },
    {
      id: 4,
      title: "Data Science Intern",
      company: "DataDriven Analytics",
      location: "New York, NY",
      type: "Remote",
      duration: "3 months",
      stipend: "$2,200/month",
      posted: "5 days ago",
      applicants: 56,
      match: 90,
      logo: "/datadriven-company-logo.jpg",
      description: "Analyze large datasets and create insights using advanced statistical methods.",
      requirements: ["Python", "SQL", "Pandas", "Data Visualization"],
    },
    {
      id: 5,
      title: "DevOps Engineer Intern",
      company: "CloudScale Systems",
      location: "Seattle, WA",
      type: "Hybrid",
      duration: "6 months",
      stipend: "$2,400/month",
      posted: "1 day ago",
      applicants: 28,
      match: 75,
      logo: "/cloudscale-company-logo.jpg",
      description: "Help maintain and optimize our cloud infrastructure and CI/CD pipelines.",
      requirements: ["Docker", "Kubernetes", "AWS", "Linux"],
    },
    {
      id: 6,
      title: "UI/UX Design Intern",
      company: "DesignHub Studio",
      location: "Los Angeles, CA",
      type: "Remote",
      duration: "3 months",
      stipend: "$1,600/month",
      posted: "4 days ago",
      applicants: 41,
      match: 70,
      logo: "/designhub-company-logo.jpg",
      description: "Create beautiful and intuitive user interfaces for web and mobile applications.",
      requirements: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    },
  ]

  const skillsData = (() => {
    const customSkillsData = [
      { skill: "Git", count: 6, category: "most" }, // Most required
      { skill: "Python", count: 5, category: "most" },
      { skill: "JavaScript", count: 5, category: "most" },
      { skill: "React.js", count: 4, category: "required" }, // Required
      { skill: "Data Analysis", count: 4, category: "required" },
      { skill: "Node.js", count: 3, category: "required" },
      { skill: "SQL", count: 3, category: "required" },
      { skill: "AWS", count: 2, category: "least" }, // Least required
      { skill: "Docker", count: 2, category: "least" },
      { skill: "Figma", count: 2, category: "least" },
    ]

    return customSkillsData.map((item) => ({
      ...item,
      percentage: Math.round((item.count / internships.length) * 100),
    }))
  })()

  const getBarColor = (category: string) => {
    switch (category) {
      case "most":
        return "url(#mostRequired)" // Teal gradient
      case "required":
        return "url(#required)" // Blue gradient
      case "least":
        return "url(#leastRequired)" // Purple gradient
      default:
        return "hsl(186, 100%, 40%)"
    }
  }

  // Removed myApplications definition here as it's now state

  const testimonials = [
    {
      name: "Rahul Verma",
      image: "/rahul.jpeg",
      rating: 5,
      company: "Google",
      role: "Software Engineering Intern",
      duration: "3 months",
      text: "An incredible learning experience! I worked on real production systems and learned from some of the best engineers in the industry. The mentorship was outstanding, and I gained hands-on experience with large-scale distributed systems. This internship opened doors to amazing career opportunities.",
    },
    {
      name: "Ananya Patel",
      image: "/ananya.jpeg",
      rating: 5,
      company: "Microsoft",
      role: "Data Science Intern",
      duration: "6 months",
      text: "The internship exceeded all my expectations. I contributed to machine learning projects that impacted millions of users. The team was supportive, and I learned advanced ML techniques, cloud computing, and agile development practices. Highly recommend for anyone serious about data science!",
    },
    {
      name: "Arjun Singh",
      image: "/arjun.jpg",
      rating: 4,
      company: "Amazon",
      role: "Full Stack Developer Intern",
      duration: "4 months",
      text: "Great exposure to full-stack development at scale. Worked on AWS services and built features used by thousands of customers. The fast-paced environment taught me to adapt quickly and deliver quality code under pressure. A challenging but rewarding experience!",
    },
    {
      name: "Priya Sharma",
      image: "/images/priya.jpg",
      rating: 5,
      company: "Meta",
      role: "Mobile App Developer Intern",
      duration: "3 months",
      text: "Working at Meta was a dream come true! I developed features for React Native apps and learned best practices for mobile development. The company culture was amazing, and I made connections that will last a lifetime. This internship transformed my career trajectory!",
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Remote":
        return "bg-green-100 text-green-800"
      case "Hybrid":
        return "bg-blue-100 text-blue-800"
      case "On-site":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSkillColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-700 border-blue-200",
      "bg-purple-100 text-purple-700 border-purple-200",
      "bg-cyan-100 text-cyan-700 border-cyan-200",
      "bg-indigo-100 text-indigo-700 border-indigo-200",
      "bg-teal-100 text-teal-700 border-teal-200",
      "bg-pink-100 text-pink-700 border-pink-200",
    ]
    return colors[index % colors.length]
  }

  const getStatusColor = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-800"
      case "green":
        return "bg-green-100 text-green-800"
      case "red":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const toggleSave = (id: number) => {
    setSavedInternships((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const [selectedApplication, setSelectedApplication] = useState<(typeof myApplications)[0] | null>(null)

  const interviewTips = [
    {
      id: 1,
      title: "How to Ace Technical Interviews",
      duration: "12:45",
      thumbnail: "/technical-interview-preparation-video-thumbnail.jpg",
      views: "125K",
      link: "https://www.youtube.com/watch?v=KdXAUst8bdo",
    },
    {
      id: 2,
      title: "Common HR Interview Questions",
      duration: "8:30",
      thumbnail: "/hr-interview-questions-video-thumbnail.jpg",
      views: "98K",
      link: "https://www.youtube.com/watch?v=naIkpQ_cIt0",
    },
    {
      id: 3,
      title: "Body Language Tips for Interviews",
      duration: "10:15",
      thumbnail: "/body-language-interview-tips-video-thumbnail.jpg",
      views: "87K",
      link: "https://www.youtube.com/watch?v=PCRx20qXYfk",
    },
    {
      id: 4,
      title: "Salary Negotiation Strategies",
      duration: "15:20",
      thumbnail: "/salary-negotiation-strategies-video-thumbnail.jpg",
      views: "156K",
      link: "https://www.youtube.com/watch?v=WChxbBSlWnQ",
    },
  ]

  const topCompanies = [
    { name: "Airbus", logo: "/airbus-company-logo.jpg" },
    { name: "Capgemini", logo: "/capgemini-company-logo.jpg" },
    { name: "Petrobras", logo: "/petrobras-company-logo.jpg" },
    { name: "Danone", logo: "/danone-company-logo.jpg" },
    { name: "Merck", logo: "/merck-company-logo.jpg" },
    { name: "Tata", logo: "/tata-company-logo.jpg" },
    { name: "Leidos", logo: "/leidos-company-logo.jpg" },
    { name: "Maxis", logo: "/maxis-company-logo.jpg" },
    { name: "Kroger", logo: "/kroger-company-logo.jpg" },
  ]

  const trendingRoles = [
    {
      role: "AI/ML Engineer",
      growth: "+45%",
      demand: "Very High",
      image: "/ai-ml-engineer-role-icon.jpg",
      gradient: "from-purple-400 to-pink-400",
    },
    {
      role: "Full Stack Developer",
      growth: "+38%",
      demand: "High",
      image: "/full-stack-developer-role-icon.jpg",
      gradient: "from-blue-400 to-cyan-400",
    },
    {
      role: "Data Scientist",
      growth: "+42%",
      demand: "Very High",
      image: "/data-scientist-role-icon.jpg",
      gradient: "from-green-400 to-teal-400",
    },
    {
      role: "Cloud Engineer",
      growth: "+35%",
      demand: "High",
      image: "/cloud-engineer-role-icon.jpg",
      gradient: "from-indigo-400 to-purple-400",
    },
    {
      role: "Cybersecurity Analyst",
      growth: "+40%",
      demand: "Very High",
      image: "/cybersecurity-analyst-role-icon.jpg",
      gradient: "from-red-400 to-orange-400",
    },
    {
      role: "Mobile Developer",
      growth: "+32%",
      demand: "Medium",
      image: "/mobile-developer-role-icon.jpg",
      gradient: "from-yellow-400 to-orange-400",
    },
  ]

  const highPayingRolesData = [
    {
      company: "Microsoft",
      salary: 7478,
      rating: 4.6,
      ceoApproval: 99,
      recommendation: 97,
      color: "#0ea5e9",
    },
    {
      company: "LinkedIn",
      salary: 7453,
      rating: 4.9,
      ceoApproval: 99,
      recommendation: 99,
      color: "#06b6d4",
    },
    {
      company: "Google",
      salary: 7382,
      rating: 4.6,
      ceoApproval: 94,
      recommendation: 95,
      color: "#14b8a6",
    },
    {
      company: "ExxonMobil",
      salary: 7280,
      rating: 4.6,
      ceoApproval: 100,
      recommendation: 92,
      color: "#10b981",
    },
    {
      company: "Yahoo",
      salary: 7107,
      rating: 4.7,
      ceoApproval: 100,
      recommendation: 97,
      color: "#22c55e",
    },
  ]

  const expertVideos = [
    {
      id: 1,
      title: "Career Path in Software Engineering",
      expert: "Sarah Johnson",
      role: "Senior Engineer at Google",
      thumbnail: "/career-path-software-engineering-video-thumbnail.jpg",
      duration: "18:30",
      link: "https://www.youtube.com/watch?v=g8LZ42FHUzM",
    },
    {
      id: 2,
      title: "Breaking into Data Science",
      expert: "Michael Chen",
      role: "Data Scientist at Meta",
      thumbnail: "/breaking-into-data-science-video-thumbnail.jpg",
      duration: "22:15",
      link: "https://www.youtube.com/watch?v=ua-CiDNNj30",
    },
    {
      id: 3,
      title: "From Intern to Full-Time",
      expert: "Priya Sharma",
      role: "Product Manager at Amazon",
      thumbnail: "/intern-to-fulltime-career-video-thumbnail.jpg",
      duration: "16:45",
      link: "https://www.youtube.com/watch?v=YJSGfXdZfhI",
    },
  ]

  const handleWithdrawApplication = (applicationId: string) => {
  setWithdrawDialog({ show: true, applicationId });
};


  const confirmWithdraw = async () => {
  if (!withdrawDialog.applicationId) return;

  try {
    const res = await fetch(`/api/application?id=${withdrawDialog.applicationId}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (result.success) {
      setMyApplications((prev) =>
        prev.filter((app) => app._id !== withdrawDialog.applicationId)
      );

      toast({
        title: "Application withdrawn",
        description: "Your application has been removed from MongoDB.",
      });
    } else {
      toast({
        title: "Failed to withdraw",
        description: result.message || "Error removing application.",
        variant: "destructive",
      });
    }
  } catch (err) {
    toast({
      title: "Error",
      description: "Something went wrong while withdrawing.",
      variant: "destructive",
    });
  } finally {
    setWithdrawDialog({ show: false, applicationId: null });
  }
};


  const handleRemoveFeedback = (internshipId: number) => {
    setRemoveFeedbackDialog({ show: true, internshipId })
  }

const confirmRemoveFeedback = async (internshipTitle: string) => {
  if (!window.confirm("Are you sure you want to remove this feedback?")) return;

  try {
    // 1️⃣ Find the feedback document for this internship
    const res = await fetch(`/api/internshipfeedback?internship=${encodeURIComponent(internshipTitle)}`);
    const data = await res.json();

    if (!data.success || !data.feedback?._id) {
      toast({
        title: "Feedback not found",
        description: "Could not locate feedback record for deletion.",
        variant: "destructive",
      });
      return;
    }

    const feedbackId = data.feedback._id;

    // 2️⃣ Delete the feedback by its _id
    const deleteRes = await fetch(`/api/internshipfeedback?id=${feedbackId}`, { method: "DELETE" });
    const result = await deleteRes.json();

    if (result.success) {
      // 3️⃣ Update UI instantly
      setCompletedInternships((prev) =>
        prev.map((internship) =>
          internship.role === internshipTitle
            ? { ...internship, feedbackProvided: false }
            : internship
        )
      );

      toast({
        title: "Feedback removed",
        description: "Feedback deleted successfully from MongoDB.",
      });
    } else {
      toast({
        title: "Failed to remove feedback",
        description: result.message || "Error deleting feedback.",
        variant: "destructive",
      });
    }
  } catch (err) {
    console.error("Error removing feedback:", err);
    toast({
      title: "Error",
      description: "Something went wrong while removing feedback.",
      variant: "destructive",
    });
  }
};



  const filteredInternships = internships.filter((internship) => {
    if (
      searchQuery &&
      !internship.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !internship.company.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    if (filters.type.length > 0 && !filters.type.includes(internship.type)) {
      return false
    }

    if (filters.duration.length > 0) {
      const months = Number.parseInt(internship.duration)
      let matchesDuration = false
      if (filters.duration.includes("1-3") && months >= 1 && months <= 3) matchesDuration = true
      if (filters.duration.includes("3-6") && months > 3 && months <= 6) matchesDuration = true
      if (!matchesDuration) return false
    }

    return true
  })

  const [completedInternships, setCompletedInternships] = useState([
    {
      id: 1,
      company: "Google",
      role: "Software Engineering Intern",
      duration: "3 months",
      status: "completed",
      completedDate: "Dec 2023",
      feedbackProvided: false,
    },
    {
      id: 2,
      company: "Microsoft",
      role: "Data Science Intern",
      duration: "6 months",
      status: "in-progress",
      progress: 65,
      feedbackProvided: false,
    },
    {
      id: 3,
      company: "Amazon",
      role: "Full Stack Developer Intern",
      duration: "4 months",
      status: "completed",
      completedDate: "Nov 2023",
      feedbackProvided: true,
    },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 flex flex-col">
      <StudentHeader />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
            <div className="relative h-[400px]">
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
                    <div className="container mx-auto px-8">
                      <h2 className="text-5xl font-bold text-white mb-4">{slide.title}</h2>
                      <p className="text-xl text-gray-200 mb-6">{slide.subtitle}</p>
                      <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        {slide.cta}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? "bg-white w-8" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Internship Hub</h1>
            <p className="text-gray-600">Discover and apply to internship opportunities</p>
          </div>

          <Tabs value={activeTab} className="space-y-15" onValueChange={setActiveTab}>

            <TabsList className="bg-white p-1 rounded-lg shadow-sm mb-6 border gap-x-29.5 ">
              <TabsTrigger
                value="browse"
                className=" ml-25 bg-gradient-to-r from-cyan-100 via-white to-cyan-50 text-cyan-800 hover:bg-gradient-to-r hover:from-cyan-200 hover:via-cyan-50 hover:to-cyan-100 hover:text-cyan-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-800 data-[state=active]:via-cyan-600 data-[state=active]:to-cyan-400 data-[state=active]:text-white transition-all duration-300  px-2"
              >
                Browse Internships
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="ml-10 bg-gradient-to-r from-cyan-100 via-white to-cyan-50 text-cyan-800 hover:bg-gradient-to-r hover:from-cyan-200 hover:via-cyan-50 hover:to-cyan-100 hover:text-cyan-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-800 data-[state=active]:via-cyan-600 data-[state=active]:to-cyan-400 data-[state=active]:text-white transition-all duration-300 px-2"
              >
                My Applications
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="mr-10 bg-gradient-to-r from-cyan-100 via-white to-cyan-50 text-cyan-800 hover:bg-gradient-to-r hover:from-cyan-200 hover:via-cyan-50 hover:to-cyan-100 hover:text-cyan-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-800 data-[state=active]:via-cyan-600 data-[state=active]:to-cyan-400 data-[state=active]:text-white transition-all duration-300 px-2"
              >
                Saved Internships
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="mr-25 bg-gradient-to-r from-cyan-100 via-white to-cyan-50 text-cyan-800 hover:bg-gradient-to-r hover:from-cyan-200 hover:via-cyan-50 hover:to-cyan-100 hover:text-cyan-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-800 data-[state=active]:via-cyan-600 data-[state=active]:to-cyan-400 data-[state=active]:text-white transition-all duration-300  px-2"
              >
                Completed & In-Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search internships by title, company, or skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" onClick={() => setShowFilters(true)}>
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {filteredInternships.map((internship) => (
                  <Card key={internship.id} className="hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex gap-6">
                        <img
                          src={internship.logo || "/placeholder.svg"}
                          alt={internship.company}
                          className="w-20 h-20 rounded-lg object-cover shadow-md"
                        />

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{internship.title}</h3>
                              <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <Building2 className="h-4 w-4" />
                                <span className="font-medium">{internship.company}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-cyan-100 text-cyan-800">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {internship.match}% Match
                              </Badge>
                              <Button variant="ghost" size="sm" onClick={() => toggleSave(internship.id)}>
                                <Heart
                                  className={`h-5 w-5 ${savedInternships.includes(internship.id) ? "fill-red-500 text-red-500" : ""}`}
                                />
                              </Button>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4">{internship.description}</p>

                          <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center gap-1 text-sm text-gray-700">
                              <MapPin className="h-4 w-4 text-red-500" />
                              <span className="font-bold">{internship.location}</span>
                            </div>
                            <Badge className={getTypeColor(internship.type)}>{internship.type}</Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              {internship.duration}
                            </div>
                            <div className="flex items-center gap-1 text-sm font-semibold text-cyan-800">
                              <DollarSign className="h-4 w-4" />
                              {internship.stipend}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {internship.requirements.map((req, index) => (
                              <Badge key={index} variant="outline" className={`text-xs border ${getSkillColor(index)}`}>
                                {req}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-orange-600 font-medium">
                                <Calendar className="h-4 w-4" />
                                Posted {internship.posted}
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Briefcase className="h-4 w-4" />
                                {internship.applicants} applicants
                              </div>
                            </div>
                            {/* < If appliedInternships.includes(internship.id) ? (
                              <Button disabled className="bg-gray-400">
                                Submitted
                              </Button>
                            ) : ( */}
                            <Link href={`/student/internships/apply?id=${internship.id}`}>
                              <Button className="bg-cyan-600 hover:bg-cyan-700">Apply Now</Button>
                            </Link>
                            {/* ) */}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12 mb-12">
                <Card className="shadow-xl border-2">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-gray-900">Most Required Skills</CardTitle>
                    <CardDescription className="text-base">
                      Top skills demanded across all internship opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        count: {
                          label: "Number of Internships",
                          color: "hsl(186, 100%, 40%)",
                        },
                      }}
                      className="h-[400px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={skillsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                          <defs>
                            <linearGradient id="mostRequired" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.9} />
                              <stop offset="100%" stopColor="#0d9488" stopOpacity={0.7} />
                            </linearGradient>
                            <linearGradient id="required" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.7} />
                            </linearGradient>
                            <linearGradient id="leastRequired" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                              <stop offset="100%" stopColor="#9333ea" stopOpacity={0.7} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="skill"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            tick={{ fill: "#374151", fontSize: 12 }}
                          />
                          <YAxis
                            tick={{ fill: "#374151", fontSize: 12 }}
                            label={{ value: "Demand", angle: -90, position: "insideLeft" }}
                          />
                          <ChartTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const category = payload[0].payload.category
                                const categoryLabel =
                                  category === "most"
                                    ? "Most Required"
                                    : category === "required"
                                      ? "Required"
                                      : "Least Required"
                                const categoryColor =
                                  category === "most"
                                    ? "text-teal-700 bg-teal-50 border-teal-200"
                                    : category === "required"
                                      ? "text-blue-700 bg-blue-50 border-blue-200"
                                      : "text-purple-700 bg-purple-50 border-purple-200"

                                return (
                                  <div className="bg-white p-3 border-2 border-gray-200 rounded-lg shadow-lg">
                                    <p className="font-bold text-gray-900">{payload[0].payload.skill}</p>
                                    <p
                                      className={`text-xs font-semibold px-2 py-1 rounded mt-1 inline-block ${categoryColor}`}
                                    >
                                      {categoryLabel}
                                    </p>
                                    <p className="text-sm text-gray-700 mt-2">
                                      Required in <span className="font-bold">{payload[0].value}</span> internships
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {payload[0].payload.percentage}% of all positions
                                    </p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                            {skillsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getBarColor(entry.category)} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-b from-teal-500 to-teal-600" />
                        <span className="font-medium text-gray-700">Most Required</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-b from-blue-500 to-blue-600" />
                        <span className="font-medium text-gray-700">Required</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-b from-purple-500 to-purple-600" />
                        <span className="font-medium text-gray-700">Least Required</span>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-bold text-cyan-800">Pro Tip:</span> Focus on developing these in-demand
                        skills to increase your chances of landing your dream internship. Consider taking courses or
                        building projects that showcase these competencies.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12">
                <Card className="shadow-xl border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-cyan-100 p-3 rounded-lg">
                        <Play className="h-6 w-6 text-cyan-600" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold text-gray-900">Interview Tips Videos</CardTitle>
                        <CardDescription className="text-base">
                          Expert advice to help you ace your interviews
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {interviewTips.map((video) => (
                        <a key={video.id} href={video.link} target="_blank" rel="noopener noreferrer" className="block">
                          <Card className="hover:shadow-lg transition-all cursor-pointer group">
                            <div className="relative">
                              <img
                                src={video.thumbnail || "/placeholder.svg"}
                                alt={video.title}
                                className="w-full h-40 object-cover rounded-t-lg"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg">
                                <div className="bg-white rounded-full p-4">
                                  <Play className="h-8 w-8 text-cyan-600 fill-cyan-600" />
                                </div>
                              </div>
                              <Badge className="absolute top-2 right-2 bg-black/70 text-white">{video.duration}</Badge>
                              <ExternalLink className="absolute top-2 left-2 h-4 w-4 text-white" />
                            </div>
                            <CardContent className="pt-4">
                              <h4 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h4>
                              <p className="text-xs text-gray-500">{video.views} views</p>
                            </CardContent>
                          </Card>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12">
                <Card className="shadow-xl border-2 bg-white">
                  <CardContent className="pt-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                      <div className="lg:w-1/2 grid grid-cols-3 gap-8">
                        {topCompanies.map((company) => (
                          <div
                            key={company.name}
                            className="flex items-center justify-center p-4 hover:scale-110 transition-transform"
                          >
                            <img
                              src={company.logo || "/placeholder.svg"}
                              alt={company.name}
                              className="w-24 h-24 object-contain grayscale hover:grayscale-0 transition-all"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="lg:w-1/2 space-y-4">
                        <h2 className="text-4xl font-bold text-gray-900">
                          Top companies develop skills with IntelAcad
                        </h2>
                        <p className="text-lg text-gray-600">
                          Join over 4,700 companies that have partnered with IntelAcad to transform their workforce and
                          recruit top talent from our platform.
                        </p>
                        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white mt-4">Explore Partnerships</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12">
                <Card className="shadow-xl border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold text-gray-900">Trending Job Roles</CardTitle>
                        <CardDescription className="text-base">
                          Most in-demand roles in the current market
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trendingRoles.map((item) => (
                        <Card
                          key={item.role}
                          className={`hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br ${item.gradient} border-0 overflow-hidden group`}
                        >
                          <CardContent className="pt-6 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                            <div className="relative z-10">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.role}
                                    className="w-12 h-12 object-contain"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-lg text-white mb-2">{item.role}</h4>
                                  <Badge className="bg-white/90 text-gray-900 text-xs font-semibold">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    {item.growth}
                                  </Badge>
                                </div>
                              </div>
                              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mt-4">
                                <p className="text-sm font-semibold text-white">Demand: {item.demand}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12">
                <Card className="shadow-xl border-2 bg-white">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <DollarSign className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold text-gray-900">
                          Highest Paying Internships in the US
                        </CardTitle>
                        <CardDescription className="text-base">Average monthly salary comparison</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {highPayingRolesData.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-4 items-center p-4 rounded-lg hover:bg-gray-50 transition-all group"
                        >
                          <div className="col-span-2 font-bold text-gray-700">{item.company}</div>
                          <div className="col-span-5">
                            <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden">
                              <div
                                className="absolute inset-y-0 left-0 rounded-lg transition-all duration-1000 ease-out group-hover:animate-pulse"
                                style={{
                                  width: `${(item.salary / 7500) * 100}%`,
                                  background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-start pl-4">
                                <span className="font-bold text-white text-lg drop-shadow-lg">${item.salary}</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-5 grid grid-cols-3 gap-2 text-center">
                            <div className="bg-yellow-50 rounded-lg p-2">
                              <p className="text-xs text-gray-600">Rating</p>
                              <p className="font-bold text-yellow-700">{item.rating}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-2">
                              <p className="text-xs text-gray-600">CEO</p>
                              <p className="font-bold text-green-700">{item.ceoApproval}%</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-2">
                              <p className="text-xs text-gray-600">Recommend</p>
                              <p className="font-bold text-blue-700">{item.recommendation}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12">
                <Card className="shadow-xl border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold text-gray-900">Expert Career Advice</CardTitle>
                        <CardDescription className="text-base">
                          Learn from industry professionals and successful interns
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      {expertVideos.map((video) => (
                        <a key={video.id} href={video.link} target="_blank" rel="noopener noreferrer" className="block">
                          <Card className="hover:shadow-lg transition-all cursor-pointer group">
                            <div className="relative">
                              <img
                                src={video.thumbnail || "/placeholder.svg"}
                                alt={video.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg">
                                <div className="bg-white rounded-full p-4">
                                  <Play className="h-8 w-8 text-cyan-600 fill-cyan-600" />
                                </div>
                              </div>
                              <Badge className="absolute top-2 right-2 bg-black/70 text-white">{video.duration}</Badge>
                              <ExternalLink className="absolute top-2 left-2 h-4 w-4 text-white" />
                            </div>
                            <CardContent className="pt-4">
                              <h4 className="font-semibold text-base mb-2 line-clamp-2">{video.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Award className="h-4 w-4" />
                                <div>
                                  <p className="font-medium">{video.expert}</p>
                                  <p className="text-xs">{video.role}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Internship Experiences</h2>
                <div className="relative">
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out gap-6"
                      style={{ transform: `translateX(-${testimonialSlide * 50}%)` }}
                    >
                      {testimonials.map((testimonial, index) => (
                        <div key={index} className="min-w-[calc(50%-12px)]">
                          <Card className="hover:shadow-xl transition-all duration-300 border-2 h-full">
                            <CardContent className="p-6">
                              <div className="flex gap-4 items-start">
                                <div className="flex-shrink-0">
                                  <img
                                    src={testimonial.image || "/placeholder.svg"}
                                    alt={testimonial.name}
                                    className="w-24 h-24 rounded-xl object-cover shadow-md"
                                  />
                                </div>

                                <div className="flex-1 space-y-3">
                                  <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{testimonial.name}</h3>
                                    <div className="flex gap-1 mb-2">
                                      {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className="h-4 w-4 text-yellow-500 fill-yellow-500 stroke-yellow-600 stroke-[1.5]"
                                        />
                                      ))}
                                    </div>
                                  </div>

                                  <div className="pb-3 border-b border-gray-200">
                                    <p className="text-sm font-bold text-cyan-700 mb-0.5">{testimonial.role}</p>
                                    <p className="text-sm text-gray-700 font-medium">{testimonial.company}</p>
                                    <p className="text-xs text-gray-500 mt-1">Duration: {testimonial.duration}</p>
                                  </div>

                                  <div className="pt-1">
                                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                                      {testimonial.text}
                                    </p>
                                  </div>

                                  <div className="pt-2 flex items-center gap-3">
                                    <Badge className="bg-cyan-100 text-cyan-800 px-2 py-0.5 text-xs">
                                      Verified Intern
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setTestimonialSlide((prev) => Math.max(0, prev - 2))}
                    disabled={testimonialSlide === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg border-2 border-gray-200 transition-all hover:scale-110 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous testimonials"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setTestimonialSlide((prev) => Math.min(testimonials.length - 2, prev + 2))}
                    disabled={testimonialSlide >= testimonials.length - 2}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg border-2 border-gray-200 transition-all hover:scale-110 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next testimonials"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-700" />
                  </button>

                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: Math.ceil(testimonials.length / 2) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setTestimonialSlide(index * 2)}
                        className={`h-2 rounded-full transition-all ${
                          Math.floor(testimonialSlide / 2) === index ? "bg-cyan-600 w-8" : "bg-gray-300 w-2"
                        }`}
                        aria-label={`Go to testimonials ${index * 2 + 1}-${index * 2 + 2}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Applications</CardTitle>
                  <CardDescription>Track the status of your internship applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myApplications.map((app) => (
                      <div
                         key={app._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div>
                          <h4 className="font-semibold text-lg">{app.position || "Internship Position"}</h4>
                          <p className="text-gray-600">{app.company || "Company Name"}</p>
                          <p className="text-sm text-gray-500 mt-1">Applied on {app.appliedDate}</p>
                        </div>
                        <div className="text-right flex flex-col gap-2">
                          <Badge className={getStatusColor(app.statusColor)}>{app.status}</Badge>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent"
                              onClick={() => setSelectedApplication(app)}
                            >
                              View Details
                            </Button>
                            {app.status !== "Rejected" && (
  <Button
    variant="destructive"
    size="sm"
    onClick={() => handleWithdrawApplication(app._id)} // ✅ changed from app.id to app._id
  >
    Withdraw
  </Button>
)}

                          </div>
                        </div>
                      </div>
                    ))}
                    {myApplications.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No applications yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600">Total Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">12</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600">Under Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">5</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600">Interviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">3</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600">Response Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-cyan-800">67%</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Internships</CardTitle>
                  <CardDescription>Internships you've bookmarked for later</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {internships
                      .filter((int) => savedInternships.includes(int.id))
                      .map((internship) => (
                        <div
                          key={internship.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex gap-4">
                            <img
                              src={internship.logo || "/placeholder.svg"}
                              alt={internship.company}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-semibold text-lg">{internship.title}</h4>
                              <p className="text-gray-600">{internship.company}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <Badge className={getTypeColor(internship.type)}>{internship.type}</Badge>
                                <span className="text-sm text-gray-600">{internship.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => toggleSave(internship.id)}>
                              Remove
                            </Button>
                            <Link href={`/student/internships/apply?id=${internship.id}`}>
                              <Button size="sm" className="bg-cyan-800 hover:bg-cyan-700">
                                Apply
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    {savedInternships.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No saved internships yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Completed & In-Progress Internships</CardTitle>
                  <CardDescription>Track your internship journey and provide feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedInternships.map((internship) => (
                      <div
                        key={internship.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{internship.role}</h4>
                          <p className="text-gray-600">{internship.company}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge
                              className={
                                internship.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {internship.status === "completed" ? "Completed" : "In Progress"}
                            </Badge>
                            <span className="text-sm text-gray-600">Duration: {internship.duration}</span>
                          </div>
                          {internship.status === "in-progress" && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{internship.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-cyan-600 h-2 rounded-full transition-all"
                                  style={{ width: `${internship.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4 flex flex-col gap-2">
  {internship.status === "completed" && (
    <>
      {internship.feedbackProvided ? (
        <>
          {/* ✅ Submitted indicator */}
          <Button size="sm" variant="outline" disabled className="bg-gray-100">
            ✅ Submitted
          </Button>

          {/* ✅ Edit Feedback */}
          <Link
            href={`/student/internships/feedback?internship=${encodeURIComponent(
              internship.role
            )}&edit=true`}
          >
            <Button
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700 w-full"
            >
              Edit Feedback
            </Button>
          </Link>

          {/* ✅ Remove Feedback */}
          <Button
            size="sm"
            variant="destructive"
            className="w-full"
            onClick={() => confirmRemoveFeedback(internship.role)}
          >
            Remove Feedback
          </Button>
        </>
      ) : (
        <>
          {/* ✅ Provide Feedback */}
          <Link
            href={`/student/internships/feedback?internship=${encodeURIComponent(
              internship.role
            )}&edit=false`}
          >
            <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
              Provide Feedback
            </Button>
          </Link>
        </>
      )}
    </>
  )}
</div>


                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>View your submitted application details</DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                <Card>
                  <CardContent className="pt-4 grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Full Name</p>
                      <p className="font-semibold">{selectedApplication.fullName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-semibold">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Mobile</p>
                      <p className="font-semibold">{selectedApplication.mobile}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date of Birth</p>
                      <p className="font-semibold">{selectedApplication.dob}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Academic Information</h3>
                <Card>
                  <CardContent className="pt-4 grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">University</p>
                      <p className="font-semibold">{selectedApplication.university}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Course</p>
                      <p className="font-semibold">{selectedApplication.course}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">CGPA</p>
                      <p className="font-semibold">{selectedApplication.cgpa}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Skills & Languages</h3>
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.skills?.map((skill: string) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.languages?.map((lang: string) => (
                          <Badge key={lang} variant="secondary">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Internships</DialogTitle>
            <DialogDescription>Refine your search with these filters</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Type</Label>
              <div className="space-y-2">
                {["Remote", "Hybrid", "On-site"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.type.includes(type)}
                      onCheckedChange={(checked) => {
                        setFilters((prev) => ({
                          ...prev,
                          type: checked ? [...prev.type, type] : prev.type.filter((t) => t !== type),
                        }))
                      }}
                    />
                    <Label htmlFor={type} className="font-normal cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Duration</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="1-3"
                    checked={filters.duration.includes("1-3")}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        duration: checked ? [...prev.duration, "1-3"] : prev.duration.filter((d) => d !== "1-3"),
                      }))
                    }}
                  />
                  <Label htmlFor="1-3" className="font-normal cursor-pointer">
                    1-3 months
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="3-6"
                    checked={filters.duration.includes("3-6")}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        duration: checked ? [...prev.duration, "3-6"] : prev.duration.filter((d) => d !== "3-6"),
                      }))
                    }}
                  />
                  <Label htmlFor="3-6" className="font-normal cursor-pointer">
                    3-6 months
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                setFilters({ type: [], duration: [], stipend: [] })
              }}
            >
              Clear All
            </Button>
            <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700" onClick={() => setShowFilters(false)}>
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={withdrawDialog.show} onOpenChange={(show) => setWithdrawDialog({ show, applicationId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Application?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw your application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmWithdraw} className="bg-red-600 hover:bg-red-700">
              Confirm Withdraw
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showAppliedPopup} onOpenChange={setShowAppliedPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <Sparkles className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Application Submitted!</DialogTitle>
            <DialogDescription className="text-center text-base">
              Your application has been successfully submitted. The company will review your profile and get back to you
              soon.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={() => setShowAppliedPopup(false)} className="bg-cyan-600 hover:bg-cyan-700">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={removeFeedbackDialog.show}
        onOpenChange={(show) => setRemoveFeedbackDialog({ show, internshipId: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Feedback?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove your feedback? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (removeFeedbackDialog.internshipId !== null) {
                  // Find the internship title by id
                  const internship = completedInternships.find(
                    (item) => item.id === removeFeedbackDialog.internshipId
                  );
                  if (internship) {
                    confirmRemoveFeedback(internship.role);
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove Feedback
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
