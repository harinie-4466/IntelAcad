"use client"

import { StudentHeader } from "@/components/student-header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  Search,
  Star,
  TrendingUp,
  Users,
  Filter,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
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

export default function CertificationsHub() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("explore")
  
  const [filters, setFilters] = useState({
    cost: [] as string[],
    level: [] as string[],
    rating: "",
    duration: [] as string[],
  })
  const [viewCertModalOpen, setViewCertModalOpen] = useState(false)
  const [selectedCertImage, setSelectedCertImage] = useState("")
  const [removeFeedbackDialog, setRemoveFeedbackDialog] = useState<{ show: boolean; certTitle: string | null }>({
    show: false,
    certTitle: null,
  })
  const { toast } = useToast()

  const heroSlides = [
    {
      title: "Meet your new AI conversation coach",
      subtitle: "Master technical interviews with AI-powered practice",
      image: "/images/hero-ai-coach.jpg",
      cta: "Find courses",
    },
    {
      title: "Top Trending Certifications",
      subtitle: "Stay ahead with the most in-demand skills",
      image: "/images/hero-trending.jpg",
      cta: "Explore now",
    },
    {
      title: "Cloud Computing Mastery",
      subtitle: "AWS, Azure, and Google Cloud certifications",
      image: "/images/hero-cloud.jpg",
      cta: "Start learning",
    },
  ]

  const trendsData = [
    { month: "Jan", "AI/ML": 45, "Web Dev": 38, Cybersecurity: 28, Cloud: 42, DevOps: 25 },
    { month: "Feb", "AI/ML": 52, "Web Dev": 42, Cybersecurity: 32, Cloud: 48, DevOps: 28 },
    { month: "Mar", "AI/ML": 61, "Web Dev": 45, Cybersecurity: 35, Cloud: 55, DevOps: 32 },
    { month: "Apr", "AI/ML": 68, "Web Dev": 48, Cybersecurity: 38, Cloud: 58, DevOps: 35 },
    { month: "May", "AI/ML": 75, "Web Dev": 52, Cybersecurity: 42, Cloud: 62, DevOps: 38 },
    { month: "Jun", "AI/ML": 82, "Web Dev": 55, Cybersecurity: 45, Cloud: 68, DevOps: 42 },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const certifications = [
    {
      id: 1,
      title: "AWS Certified Solutions Architect",
      provider: "Amazon Web Services",
      category: "Cloud Computing",
      level: "Professional",
      duration: "40 hours",
      rating: 4.8,
      students: "125K",
      price: "$299",
      recommended: true,
      image: "/images/aws-certified-solutions-architect-badge.jpg",
      externalLink: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    },
    {
      id: 2,
      title: "Google Data Analytics Professional",
      provider: "Google",
      category: "Data Science",
      level: "Beginner",
      duration: "30 hours",
      rating: 4.9,
      students: "200K",
      price: "$49/month",
      recommended: true,
      image: "/images/google-data-analytics-cert.jpg",
      externalLink: "https://www.coursera.org/professional-certificates/google-data-analytics",
    },
    {
      id: 3,
      title: "Meta Front-End Developer",
      provider: "Meta",
      category: "Web Development",
      level: "Intermediate",
      duration: "35 hours",
      rating: 4.7,
      students: "180K",
      price: "$49/month",
      recommended: false,
      image: "/images/meta-frontend-developer-cert.jpg",
      externalLink: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    },
    {
      id: 4,
      title: "Machine Learning Specialization",
      provider: "DeepLearning.AI",
      category: "AI & ML",
      level: "Intermediate",
      duration: "50 hours",
      rating: 4.9,
      students: "300K",
      price: "$49/month",
      recommended: true,
      image: "/images/machine-learning-specialization.jpg",
      externalLink: "https://www.coursera.org/specializations/machine-learning-introduction",
    },
    {
      id: 5,
      title: "Certified Kubernetes Administrator",
      provider: "Linux Foundation",
      category: "DevOps",
      level: "Advanced",
      duration: "45 hours",
      rating: 4.6,
      students: "85K",
      price: "$395",
      recommended: false,
      image: "/images/kubernetes-cka-cert.jpg",
      externalLink: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/",
    },
    {
      id: 6,
      title: "Full Stack Web Development",
      provider: "freeCodeCamp",
      category: "Web Development",
      level: "Beginner",
      duration: "60 hours",
      rating: 4.8,
      students: "500K",
      price: "Free",
      recommended: true,
      image: "/images/freecodecamp-fullstack-cert.jpg",
      externalLink: "https://www.freecodecamp.org/learn/",
    },
    {
      id: 7,
      title: "Python for Data Science",
      provider: "IBM",
      category: "Data Science",
      level: "Beginner",
      duration: "25 hours",
      rating: 4.7,
      students: "150K",
      price: "$39/month",
      recommended: true,
      image: "/images/ibm-python-data-science-cert.jpg",
      externalLink: "https://www.coursera.org/learn/python-for-applied-data-science-ai",
    },
    {
      id: 8,
      title: "Cybersecurity Fundamentals",
      provider: "Cisco",
      category: "Cybersecurity",
      level: "Beginner",
      duration: "30 hours",
      rating: 4.6,
      students: "95K",
      price: "Free",
      recommended: false,
      image: "/images/cisco-cybersecurity-fundamentals.jpg",
      externalLink: "https://www.netacad.com/courses/cybersecurity",
    },
    {
      id: 9,
      title: "Azure Administrator Associate",
      provider: "Microsoft",
      category: "Cloud Computing",
      level: "Intermediate",
      duration: "38 hours",
      rating: 4.7,
      students: "110K",
      price: "$165",
      recommended: true,
      image: "/images/microsoft-azure-administrator.jpg",
      externalLink: "https://learn.microsoft.com/en-us/certifications/azure-administrator/",
    },
    {
      id: 10,
      title: "Google Cloud Professional",
      provider: "Google Cloud",
      category: "Cloud Computing",
      level: "Professional",
      duration: "42 hours",
      rating: 4.8,
      students: "98K",
      price: "$200",
      recommended: false,
      image: "/images/google-cloud-professional-architect.jpg",
      externalLink: "https://cloud.google.com/certification/cloud-architect",
    },
    {
      id: 11,
      title: "Deep Learning Specialization",
      provider: "DeepLearning.AI",
      category: "AI & ML",
      level: "Advanced",
      duration: "55 hours",
      rating: 4.9,
      students: "250K",
      price: "$49/month",
      recommended: true,
      image: "/images/deeplearningai-specialization.jpg",
      externalLink: "https://www.coursera.org/specializations/deep-learning",
    },
    {
      id: 12,
      title: "React Native Development",
      provider: "Meta",
      category: "Web Development",
      level: "Intermediate",
      duration: "32 hours",
      rating: 4.6,
      students: "140K",
      price: "$49/month",
      recommended: false,
      image: "/images/meta-react-native.jpg",
      externalLink: "https://www.coursera.org/learn/react-native",
    },
    {
      id: 13,
      title: "TensorFlow Developer Certificate",
      provider: "Google",
      category: "AI & ML",
      level: "Intermediate",
      duration: "48 hours",
      rating: 4.8,
      students: "175K",
      price: "$100",
      recommended: true,
      image: "/images/tensorflow-developer-certificate.jpg",
      externalLink: "https://www.tensorflow.org/certificate",
    },
    {
      id: 14,
      title: "Ethical Hacking Essentials",
      provider: "EC-Council",
      category: "Cybersecurity",
      level: "Intermediate",
      duration: "40 hours",
      rating: 4.7,
      students: "88K",
      price: "$299",
      recommended: false,
      image: "/images/ec-council-ethical-hacking.jpg",
      externalLink: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/",
    },
    {
      id: 15,
      title: "DevOps Engineering",
      provider: "AWS",
      category: "DevOps",
      level: "Professional",
      duration: "50 hours",
      rating: 4.8,
      students: "92K",
      price: "$300",
      recommended: true,
      image: "/images/aws-devops-engineer.jpg",
      externalLink: "https://aws.amazon.com/certification/certified-devops-engineer-professional/",
    },
    {
      id: 16,
      title: "Blockchain Fundamentals",
      provider: "IBM",
      category: "Web Development",
      level: "Beginner",
      duration: "28 hours",
      rating: 4.5,
      students: "75K",
      price: "$39/month",
      recommended: false,
      image: "/images/blockcahin.png",
      externalLink: "https://www.coursera.org/learn/blockchain-basics",
    },
    {
      id: 17,
      title: "SQL for Data Analysis",
      provider: "Udacity",
      category: "Data Science",
      level: "Beginner",
      duration: "20 hours",
      rating: 4.6,
      students: "160K",
      price: "Free",
      recommended: true,
      image: "/images/sql.png",
      externalLink: "https://www.udacity.com/course/sql-for-data-analysis--ud198",
    },
    {
      id: 18,
      title: "CompTIA Security+",
      provider: "CompTIA",
      category: "Cybersecurity",
      level: "Intermediate",
      duration: "45 hours",
      rating: 4.7,
      students: "120K",
      price: "$370",
      recommended: false,
      image: "/images/comptia.png",
      externalLink: "https://www.comptia.org/certifications/security",
    },
    {
      id: 19,
      title: "Docker & Kubernetes",
      provider: "Udemy",
      category: "DevOps",
      level: "Intermediate",
      duration: "35 hours",
      rating: 4.8,
      students: "105K",
      price: "$89",
      recommended: true,
      image: "/images/docker.png",
      externalLink: "https://www.udemy.com/course/docker-kubernetes/",
    },
    {
      id: 20,
      title: "Natural Language Processing",
      provider: "Stanford Online",
      category: "AI & ML",
      level: "Advanced",
      duration: "60 hours",
      rating: 4.9,
      students: "85K",
      price: "$49/month",
      recommended: true,
      image: "/images/nlp.png",
      externalLink: "https://online.stanford.edu/courses/cs224n-natural-language-processing-deep-learning",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      image: "/images/sarah.jpeg",
      rating: 5,
      certification: "AWS Solutions Architect",
      duration: "40 hours",
      text: "This certification completely transformed my career. The hands-on labs and real-world scenarios prepared me perfectly for cloud architecture roles. I landed a cloud engineer position within 2 months of completion with a 40% salary increase!",
    },
    {
      name: "Michael Chen",
      image: "/images/chen.jpeg",
      rating: 5,
      certification: "Machine Learning Specialization",
      duration: "50 hours",
      text: "The hands-on projects were invaluable. I learned everything from linear regression to neural networks. Now I confidently build and deploy ML models for my company's recommendation system.",
    },
    {
      name: "Priya Sharma",
      image: "/images/priya.jpg",
      rating: 4,
      certification: "Google Data Analytics",
      duration: "30 hours",
      text: "Great for beginners! The structured curriculum with real datasets helped me transition from marketing to data analytics. The portfolio projects were impressive additions to my resume.",
    },
    {
      name: "David Martinez",
      image: "/images/david.jpg",
      rating: 5,
      certification: "Full Stack Development",
      duration: "60 hours",
      text: "Comprehensive coverage of both frontend and backend technologies. Built 5 production-ready projects that are now in my portfolio! The community support was exceptional throughout the journey.",
    },
  ]

  const [myCertifications, setMyCertifications] = useState([
    {
      title: "React Advanced Patterns",
      provider: "Udemy",
      completedDate: "Dec 2023",
      score: "95%",
      status: "completed",
      image: "/images/react-badge.jpeg",
      feedbackProvided: false,
    },
    {
      title: "Python for Data Science",
      provider: "Coursera",
      completedDate: "Nov 2023",
      score: "88%",
      status: "completed",
      image: "/images/python-badge.png",
      feedbackProvided: true,
    },
    {
      title: "Docker Essentials",
      provider: "LinkedIn Learning",
      completedDate: "In Progress",
      score: "65%",
      status: "in-progress",
      image: "/images/docker-badge.jpg",
      feedbackProvided: false,
    },
  ])

  const certificationFAQs = [
    {
      question: "How do certifications add value to my career?",
      answer:
        "Certifications validate your skills to employers, demonstrate commitment to professional development, often lead to higher salaries (10-20% increase on average), and help you stand out in competitive job markets. They also provide structured learning paths and keep you updated with industry standards.",
    },
    {
      question: "Will certifications improve my resume?",
      answer:
        "Yes! Certifications make your resume more competitive by showing verified expertise in specific technologies or domains. They're especially valuable for career changers, recent graduates, or professionals looking to upskill. Many employers specifically search for candidates with relevant certifications.",
    },
    {
      question: "How long does it take to complete a certification?",
      answer:
        "Duration varies by certification level and your pace. Beginner certifications typically take 20-40 hours, intermediate 40-60 hours, and advanced/professional certifications 60-100+ hours. Most platforms allow you to learn at your own pace.",
    },
    {
      question: "Are free certifications worth it?",
      answer:
        "Free certifications from reputable platforms like freeCodeCamp, Google, IBM, and Cisco are highly valued by employers. The key is choosing certifications from recognized providers that align with your career goals.",
    },
    {
      question: "Do I need prerequisites for advanced certifications?",
      answer:
        "Most advanced and professional certifications require foundational knowledge or prior certifications. Check the specific requirements for each certification. We recommend starting with beginner-level courses if you're new to a domain.",
    },
    {
      question: "Can I get a job with just certifications?",
      answer:
        "While certifications significantly boost your employability, they work best when combined with practical projects, internships, or work experience. Many employers value the combination of certifications and hands-on project portfolios.",
    },
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-blue-100 text-blue-800"
      case "Advanced":
        return "bg-purple-100 text-purple-800"
      case "Professional":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCertifications = certifications.filter((cert) => {
    // Search filter
    if (
      searchQuery &&
      !cert.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !cert.provider.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !cert.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Cost filter
    if (filters.cost.length > 0) {
      const isFree = cert.price.toLowerCase() === "free"
      if (filters.cost.includes("free") && !isFree) return false
      if (filters.cost.includes("paid") && isFree) return false
    }

    // Level filter
    if (filters.level.length > 0 && !filters.level.includes(cert.level)) {
      return false
    }

    // Rating filter
    if (filters.rating) {
      const minRating = Number.parseFloat(filters.rating)
      if (cert.rating < minRating) return false
    }

    // Duration filter
    if (filters.duration.length > 0) {
      const hours = Number.parseInt(cert.duration)
      let matchesDuration = false
      if (filters.duration.includes("under10") && hours < 10) matchesDuration = true
      if (filters.duration.includes("10-50") && hours >= 10 && hours <= 50) matchesDuration = true
      if (filters.duration.includes("50plus") && hours > 50) matchesDuration = true
      if (!matchesDuration) return false
    }

    return true
  })

  const certificationsByCategory = filteredCertifications.reduce(
    (acc, cert) => {
      if (!acc[cert.category]) {
        acc[cert.category] = []
      }
      acc[cert.category].push(cert)
      return acc
    },
    {} as Record<string, typeof certifications>,
  )

useEffect(() => {
  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("/api/certificationfeedback");
      const data = await res.json();

      if (data?.success && Array.isArray(data.feedbacks)) {
        const feedbacks: any[] = data.feedbacks; // force TS to treat it as an array

        setMyCertifications((prev) =>
          prev.map((cert) => {
            const hasFeedback = feedbacks.some(
              (fb: any) => fb.certificationName === cert.title // change 'title' if your cert key differs
            );
            return { ...cert, feedbackProvided: hasFeedback };
          })
        );
      } else {
        console.warn("No feedbacks found or unexpected API response:", data);
      }
    } catch (err) {
      console.error("Error fetching certification feedbacks:", err);
    }
  };

  fetchFeedbacks();
}, []);

useEffect(() => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("feedback") === "submitted") {
      setActiveTab("my-certs");

      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);

      // Refresh myCertifications after feedback submission
      fetch("/api/certificationfeedback")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.feedbacks)) {
            setMyCertifications((prev) =>
              prev.map((cert) => {
                const hasFeedback = data.feedbacks.some(
                  (fb: any) => fb.certificationName === cert.title
                );
                return { ...cert, feedbackProvided: hasFeedback };
              })
            );
          }
        })
        .catch((err) => console.error("Error reloading feedbacks:", err));
    }
  }
}, []);


const handleRemoveFeedback = async (certName: string) => {
  if (!window.confirm("Delete feedback for this certification?")) return;

  try {
    const res = await fetch(`/api/certificationfeedback?certification=${encodeURIComponent(certName)}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to delete");
    }

    // Update myCertifications immediately
    setMyCertifications((prev) =>
      prev.map((cert) =>
        cert.title === certName ? { ...cert, feedbackProvided: false } : cert
      )
    );

    toast({ title: "Deleted", description: "Feedback removed successfully." });
  } catch (err: any) {
    toast({
      title: "Error",
      description: err.message || "Could not delete feedback",
      variant: "destructive",
    });
  }
};





  const confirmRemoveFeedback = () => {
    if (removeFeedbackDialog.certTitle) {
      // Update the certification to remove feedback status
      setMyCertifications((prev) =>
        prev.map((cert) =>
          cert.title === removeFeedbackDialog.certTitle ? { ...cert, feedbackProvided: false } : cert,
        ),
      )

      toast({
        title: "Feedback removed",
        description: "Your feedback has been successfully removed.",
      })

      setRemoveFeedbackDialog({ show: false, certTitle: null })
    }
  }

  const handleViewCertification = (certTitle: string) => {
    // Set image based on cert title
    if (certTitle === "React Advanced Patterns") {
      setSelectedCertImage("/react-cert.avif")
    } else if (certTitle === "Python for Data Science") {
      setSelectedCertImage("/python-cert.avif")
    } else {
      setSelectedCertImage("/certificate-placeholder.jpg") // fallback image
    }
    setViewCertModalOpen(true)
  }

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
            {/* Carousel controls */}
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
            {/* Slide indicators */}
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

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-600" />
                Certification Trends
              </CardTitle>
              <CardDescription>Most popular certifications over time by domain</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="AI/ML" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Web Dev" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Cybersecurity" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="Cloud" stroke="#06b6d4" strokeWidth={2} />
                  <Line type="monotone" dataKey="DevOps" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Certification Hub</h1>
            <p className="text-gray-600">Explore and earn industry-recognized certifications</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white p-1 rounded-lg shadow-sm gap-x50">
              <TabsTrigger
                value="explore"
                className="ml-70 bg-gradient-to-r from-cyan-100 via-white to-cyan-50 text-cyan-800 hover:bg-gradient-to-r hover:from-cyan-200 hover:via-cyan-50 hover:to-cyan-100 hover:text-cyan-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-800 data-[state=active]:via-cyan-600 data-[state=active]:to-cyan-400 data-[state=active]:text-white transition-all duration-300  px-2"
              >
                Explore Certifications
              </TabsTrigger>
              <TabsTrigger
                value="my-certs"
                className="ml-30 bg-gradient-to-r from-cyan-100 via-white to-cyan-50 text-cyan-800 hover:bg-gradient-to-r hover:from-cyan-200 hover:via-cyan-50 hover:to-cyan-100 hover:text-cyan-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-800 data-[state=active]:via-cyan-600 data-[state=active]:to-cyan-400 data-[state=active]:text-white transition-all duration-300  px-2"
              >
                My Certifications
              </TabsTrigger>
              <TabsTrigger
                value="recommended"
                className="ml-30 mr-64 bg-gradient-to-r from-cyan-100 via-white to-cyan-50 text-cyan-800 hover:bg-gradient-to-r hover:from-cyan-200 hover:via-cyan-50 hover:to-cyan-100 hover:text-cyan-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-800 data-[state=active]:via-cyan-600 data-[state=active]:to-cyan-400 data-[state=active]:text-white transition-all duration-300  px-2"
              >
                Recommended for You
              </TabsTrigger>
            </TabsList>

            <TabsContent value="explore" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search certifications..."
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

              {Object.entries(certificationsByCategory).map(([category, certs]) => (
                <div key={category} className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certs.map((cert) => (
                      <Card
                        key={cert.id}
                        className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                      >
                        <img
                          src={cert.image || "/placeholder.svg"}
                          alt={cert.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between mb-2">
                            <Badge className={getLevelColor(cert.level)}>{cert.level}</Badge>
                            {cert.recommended && (
                              <Badge className="bg-cyan-100 text-cyan-800">
                                <Star className="h-3 w-3 mr-1" />
                                Top Pick
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg line-clamp-2 group-hover:text-cyan-700 transition-colors">
                            {cert.title}
                          </CardTitle>
                          <CardDescription className="text-sm">{cert.provider}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="h-4 w-4" />
                              {cert.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-semibold">{cert.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            {cert.students} students
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t">
                            <span className="text-lg font-bold text-cyan-800">{cert.price}</span>
                            <Button
                              size="sm"
                              className="bg-cyan-600 hover:bg-cyan-700"
                              onClick={() => window.open(cert.externalLink, "_blank")}
                            >
                              Start Learning
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
                <Card>
                  <CardContent className="pt-6">
                    <Accordion type="single" collapsible className="w-full">
                      {certificationFAQs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                          <AccordionContent className="text-gray-600 leading-relaxed">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Testimonials</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <Card key={index} className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <img
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold">{testimonial.name}</p>
                            <div className="flex gap-0.5">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 text-yellow-500 fill-yellow-500 stroke-yellow-600 stroke-[1.5]"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mb-3 pb-3 border-b">
                          <p className="text-sm font-semibold text-cyan-700">{testimonial.certification}</p>
                          <p className="text-xs text-gray-500">Duration: {testimonial.duration}</p>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{testimonial.text}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="my-certs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Certifications</CardTitle>
                  <CardDescription>Track your certification progress and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myCertifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md hover:scale-[1.01] transition-all duration-300 bg-white"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={cert.image || "/placeholder.svg"}
                            alt={cert.title}
                            className="w-20 h-20 rounded-lg object-contain bg-gray-50 p-2"
                          />
                          <div>
                            <h4 className="font-semibold text-lg">{cert.title}</h4>
                            <p className="text-sm text-gray-600">{cert.provider}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge
                                className={
                                  cert.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }
                              >
                                {cert.status === "completed" ? "Completed" : "In Progress"}
                              </Badge>
                              <span className="text-sm text-gray-600">Score: {cert.score}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col gap-2">
  <p className="text-sm text-gray-600 mb-2">{cert.completedDate}</p>

  {cert.status === "completed" ? (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleViewCertification(cert.title)}
      >
        View Certificate
      </Button>

      {cert.feedbackProvided ? (
        <>
          <Button
            size="sm"
            variant="outline"
            disabled
            className="bg-gray-100"
          >
            Submitted
          </Button>

          <Link
            href={`/student/certifications/feedback?cert=${encodeURIComponent(cert.title)}&edit=true`}
          >
            <Button
              size="sm"
              variant="default"
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              Edit Feedback
            </Button>
          </Link>

          <Button
            size="sm"
            variant="destructive"
            className="w-full"
            onClick={() => handleRemoveFeedback(cert.title)}
          >
            Remove Feedback
          </Button>
        </>
      ) : (
        <Link
          href={`/student/certifications/feedback?cert=${encodeURIComponent(cert.title)}`}
        >
          <Button
            size="sm"
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            Provide Feedback
          </Button>
        </Link>
      )}
    </>
  ) : (
    <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
      Continue
    </Button>
  )}
</div>

                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommended" className="space-y-6">
              <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-cyan-800" />
                    Personalized Recommendations
                  </CardTitle>
                  <CardDescription>Based on your profile, skills, and career goals</CardDescription>
                </CardHeader>
              </Card>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications
                  .filter((cert) => cert.recommended)
                  .map((cert) => (
                    <Card
                      key={cert.id}
                      className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 border-cyan-200"
                    >
                      <img
                        src={cert.image || "/placeholder.svg"}
                        alt={cert.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={getLevelColor(cert.level)}>{cert.level}</Badge>
                          <Badge className="bg-cyan-100 text-cyan-800">
                            <Star className="h-3 w-3 mr-1 fill-cyan-800" />
                            Top Pick
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{cert.title}</CardTitle>
                        <CardDescription>{cert.provider}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600">
                            This certification aligns with your career goals and will boost your prospects in{" "}
                            {cert.category}.
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t">
                            <span className="text-lg font-bold text-cyan-800">{cert.price}</span>
                            <Button
                              size="sm"
                              className="bg-cyan-600 hover:bg-cyan-700"
                              onClick={() => window.open(cert.externalLink, "_blank")}
                            >
                              Start Learning
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
                <Card>
                  <CardContent className="pt-6">
                    <Accordion type="single" collapsible className="w-full">
                      {certificationFAQs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                          <AccordionContent className="text-gray-600 leading-relaxed">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Certifications</DialogTitle>
            <DialogDescription>Refine your search with these filters</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Cost Filter */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Cost</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="free"
                    checked={filters.cost.includes("free")}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        cost: checked ? [...prev.cost, "free"] : prev.cost.filter((c) => c !== "free"),
                      }))
                    }}
                  />
                  <Label htmlFor="free" className="font-normal cursor-pointer">
                    Free
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="paid"
                    checked={filters.cost.includes("paid")}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        cost: checked ? [...prev.cost, "paid"] : prev.cost.filter((c) => c !== "paid"),
                      }))
                    }}
                  />
                  <Label htmlFor="paid" className="font-normal cursor-pointer">
                    Paid
                  </Label>
                </div>
              </div>
            </div>

            {/* Level Filter */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Level</Label>
              <div className="space-y-2">
                {["Beginner", "Intermediate", "Advanced", "Professional"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={level}
                      checked={filters.level.includes(level)}
                      onCheckedChange={(checked) => {
                        setFilters((prev) => ({
                          ...prev,
                          level: checked ? [...prev.level, level] : prev.level.filter((l) => l !== level),
                        }))
                      }}
                    />
                    <Label htmlFor={level} className="font-normal cursor-pointer">
                      {level}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Minimum Rating</Label>
              <RadioGroup
                value={filters.rating}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, rating: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4.5" id="4.5" />
                  <Label htmlFor="4.5" className="font-normal cursor-pointer">
                    4.5 stars & up
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4.0" id="4.0" />
                  <Label htmlFor="4.0" className="font-normal cursor-pointer">
                    4.0 stars & up
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="any" />
                  <Label htmlFor="any" className="font-normal cursor-pointer">
                    Any rating
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Duration Filter */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Duration</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="under10"
                    checked={filters.duration.includes("under10")}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        duration: checked
                          ? [...prev.duration, "under10"]
                          : prev.duration.filter((d) => d !== "under10"),
                      }))
                    }}
                  />
                  <Label htmlFor="under10" className="font-normal cursor-pointer">
                    Under 10 hours
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="10-50"
                    checked={filters.duration.includes("10-50")}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        duration: checked ? [...prev.duration, "10-50"] : prev.duration.filter((d) => d !== "10-50"),
                      }))
                    }}
                  />
                  <Label htmlFor="10-50" className="font-normal cursor-pointer">
                    10-50 hours
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="50plus"
                    checked={filters.duration.includes("50plus")}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        duration: checked ? [...prev.duration, "50plus"] : prev.duration.filter((d) => d !== "50plus"),
                      }))
                    }}
                  />
                  <Label htmlFor="50plus" className="font-normal cursor-pointer">
                    50+ hours
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
                setFilters({ cost: [], level: [], rating: "", duration: [] })
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

      <Dialog open={viewCertModalOpen} onOpenChange={setViewCertModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Your Certification</DialogTitle>
            <DialogDescription>Download or share your achievement</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <img
              src={selectedCertImage}
              alt="Certification"
              width={800}
              height={600}
              className="w-full h-auto rounded-lg border-2 border-cyan-200"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewCertModalOpen(false)}>
              Close
            </Button>
            <a href={selectedCertImage} download>
              <Button className="bg-cyan-600 hover:bg-cyan-700" type="button">
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={removeFeedbackDialog.show}
        onOpenChange={(show) => setRemoveFeedbackDialog({ show, certTitle: null })}
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
            <AlertDialogAction onClick={confirmRemoveFeedback} className="bg-red-600 hover:bg-red-700">
              Remove Feedback
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
