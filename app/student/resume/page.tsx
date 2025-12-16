"use client"

import { StudentHeader } from "@/components/student-header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Star,
  Play,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  Zap,
  Shield,
  Layout,
  Users,
  ArrowRight,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export default function ResumeBuilderLanding() {
  const [resumeCount, setResumeCount] = useState(0)
  const [animatedText, setAnimatedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [textIndex, setTextIndex] = useState(0)

  const texts = ["Build Your Resume", "Build Your Future", "Build Your Career"]

  // Animated text effect
  useEffect(() => {
    const currentText = texts[textIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (animatedText.length < currentText.length) {
            setAnimatedText(currentText.slice(0, animatedText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          if (animatedText.length > 0) {
            setAnimatedText(animatedText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setTextIndex((prev) => (prev + 1) % texts.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timeout)
  }, [animatedText, isDeleting, textIndex])

  // Counter animation
  useEffect(() => {
    const target = 15847
    const duration = 2000
    const increment = target / (duration / 16)
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setResumeCount(target)
        clearInterval(timer)
      } else {
        setResumeCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [])

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Google",
      image: "/professional-woman-diverse.png",
      rating: 5,
      text: "IntelAcad's resume builder helped me land my dream job at Google! The ATS optimization made all the difference.",
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      company: "Microsoft",
      image: "/professional-man.jpg",
      rating: 5,
      text: "The templates are professional and the ATS checker gave me confidence that my resume would get past the filters.",
    },
    {
      name: "Priya Sharma",
      role: "Product Manager",
      company: "Amazon",
      image: "/professional-indian-woman.png",
      rating: 5,
      text: "I created multiple versions for different roles. The interface is intuitive and the results are impressive!",
    },
    {
      name: "David Martinez",
      role: "UX Designer",
      company: "Apple",
      image: "/professional-hispanic-man.png",
      rating: 5,
      text: "Best resume builder I've used. Clean templates, easy to customize, and the export quality is perfect.",
    },
  ]

  const expertVideos = [
    {
      title: "How to Write a Winning Resume in 2024",
      expert: "Career Coach Sarah",
      duration: "12:45",
      thumbnail: "/resume-writing-expert.jpg",
      views: "125K",
      url: "https://www.youtube.com/watch?v=Tt08KmFfIYQ",
    },
    {
      title: "ATS Optimization Secrets",
      expert: "HR Manager John",
      duration: "8:30",
      thumbnail: "/ats-resume-tips.jpg",
      views: "98K",
      url: "https://www.youtube.com/watch?v=BYUy1yvjHxE",
    },
    {
      title: "Common Resume Mistakes to Avoid",
      expert: "Recruiter Emily",
      duration: "10:15",
      thumbnail: "/resume-mistakes.png",
      views: "156K",
      url: "https://www.youtube.com/watch?v=t6xJGXZ-JIc",
    },
  ]

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Better Resume in Minutes",
      description: "Create a professional resume in under 10 minutes with our intuitive builder and smart suggestions.",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Get Paid More",
      description: "Our optimized resumes help candidates secure 23% higher starting salaries on average.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Beat the Competition",
      description: "Stand out with ATS-friendly formatting that gets your resume past automated filters.",
    },
    {
      icon: <Layout className="h-6 w-6" />,
      title: "Professional Templates",
      description: "Choose from 10+ expertly designed templates tailored for different industries and roles.",
    },
    {
      icon: <CheckCircle2 className="h-6 w-6" />,
      title: "ATS Friendly",
      description: "All templates are optimized for Applicant Tracking Systems used by 98% of Fortune 500 companies.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Expert Approved",
      description: "Templates and guidelines reviewed by hiring managers and career coaches from top companies.",
    },
  ]

  const companies = [
    { name: "Google", logo: "/google-logo.png" },
    { name: "Microsoft", logo: "/microsoft-logo.png" },
    { name: "Amazon", logo: "/amazon-logo.png" },
    { name: "Apple", logo: "/apple-logo-minimalist.png" },
    { name: "Meta", logo: "/meta-logo-abstract.png" },
    { name: "Netflix", logo: "/netflix-logo.png" },
  ]

  const steps = [
    {
      number: "1",
      title: "Choose Your Path",
      description: "Upload an existing resume or start from scratch with our guided form.",
    },
    {
      number: "2",
      title: "Fill in Your Details",
      description: "Add your experience, education, skills, and projects with our easy-to-use interface.",
    },
    {
      number: "3",
      title: "Select a Template",
      description: "Pick from professional templates designed for your industry and role.",
    },
    {
      number: "4",
      title: "Optimize for ATS",
      description: "Use our ATS checker to ensure your resume passes automated screening systems.",
    },
    {
      number: "5",
      title: "Download & Apply",
      description: "Export your resume as a PDF and start applying to your dream jobs!",
    },
  ]

  const faqs = [
    {
      question: "Is the resume builder really free?",
      answer:
        "Yes! Our resume builder is completely free for students. You can create unlimited resumes and download them as PDFs.",
    },
    {
      question: "What is ATS and why does it matter?",
      answer:
        "ATS (Applicant Tracking System) is software used by 98% of Fortune 500 companies to filter resumes. Our builder ensures your resume is ATS-friendly so it gets seen by human recruiters.",
    },
    {
      question: "Can I create multiple versions of my resume?",
      answer:
        "You can create and save multiple versions of your resume, perfect for tailoring applications to different roles or companies.",
    },
    {
      question: "How long does it take to create a resume?",
      answer:
        "Most users complete their resume in 10-15 minutes. If you upload an existing resume, our parser can autofill most fields in seconds.",
    },
    {
      question: "Can I edit my resume after downloading?",
      answer:
        "Yes! Your resume is saved in your account, so you can come back anytime to make edits and download updated versions.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <StudentHeader />

      {/* Hero Section with Animated Text */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-200 px-4 py-2 text-sm font-semibold">
              <FileText className="h-4 w-4 mr-2 inline" />
              {resumeCount.toLocaleString()}+ Resumes Created
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 min-h-[120px]">
            {animatedText}
            <span className="animate-pulse">|</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create an ATS-optimized resume that gets you noticed by recruiters and lands you interviews at top
            companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/student/resume/question">
              <Button size="lg" className="bg-cyan-800 hover:bg-cyan-700 text-lg px-8 py-6 w-full sm:w-auto">
                Create Your Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="bg-white py-12 border-y">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 font-semibold mb-8">Our candidates have been hired at:</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {companies.map((company) => (
              <div
                key={company.name}
                className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
              >
                <Image
                  src={company.logo || "/placeholder.svg"}
                  alt={company.name}
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Resume Builder?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to create a professional, ATS-friendly resume that gets results.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-cyan-800 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="bg-cyan-100 text-cyan-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How to Create Your Resume</h2>
            <p className="text-lg text-gray-600">Follow these simple steps to build your perfect resume</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {steps.map((step, index) => (
              <Card key={index} className="border-2 hover:border-cyan-800 transition-all">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-cyan-800 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Videos */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Expert Resume Advice</h2>
          <p className="text-lg text-gray-600">Learn from career coaches and hiring managers</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {expertVideos.map((video, index) => (
            <a key={index} href={video.url} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
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
                  <p className="text-sm text-gray-600 mb-1">{video.expert}</p>
                  <p className="text-xs text-gray-500">{video.views} views</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* Inspirational Quote Section */}
      <section className="bg-gradient-to-r from-cyan-800 to-blue-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <svg className="h-12 w-12 text-cyan-300 mx-auto mb-6" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <blockquote className="text-2xl md:text-3xl font-bold text-white mb-4">
              "Your resume is your personal brand. Make it count."
            </blockquote>
            <p className="text-cyan-100 text-lg">— Sheryl Sandberg, COO of Meta</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-cyan-800 to-blue-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-cyan-100">Join thousands of successful job seekers</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-cyan-100">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-cyan-50 mb-2">{testimonial.text}</p>
                  <Badge className="bg-white/20 text-white hover:bg-white/30">{testimonial.company}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Everything you need to know about our resume builder</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-2">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-cyan-800 flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 ml-7">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-cyan-800 to-blue-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Build Your Perfect Resume?</h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Join {resumeCount.toLocaleString()}+ students who have created professional resumes with IntelAcad
          </p>
          <Link href="/student/resume/question">
            <Button size="lg" className="bg-white text-cyan-800 hover:bg-gray-100 text-lg px-8 py-6">
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
