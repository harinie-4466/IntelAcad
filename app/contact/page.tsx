"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Briefcase, GraduationCap, MessageSquare, HelpCircle } from "lucide-react"
import { submitContactApi } from "@/lib/api"

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    reason: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const formSection = document.getElementById("contact-form")
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Combine firstName and lastName into name, use reason as subject
      const contactData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        subject: formData.reason || 'General Inquiry',
        message: `Phone: ${formData.phone}\n\nReason: ${formData.reason}\n\nMessage:\n${formData.message}`,
      }

      const response = await submitContactApi(contactData)

      if (response.success) {
        toast({
          title: "Message sent!",
          description: "We'll get back to you as soon as possible.",
        })

        setFormData({ firstName: "", lastName: "", email: "", phone: "", reason: "", message: "" })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const helpOptions = [
    {
      icon: Briefcase,
      title: "Internship Queries",
      description: "Have questions about internship opportunities, applications, or requirements? Reach out to us.",
      link: "#contact-form",
      linkText: "Ask about internships",
    },
    {
      icon: GraduationCap,
      title: "Career Guidance",
      description: "Get personalized career advice and guidance on choosing the right internship path for your goals.",
      link: "#contact-form",
      linkText: "Get career help",
    },
    {
      icon: MessageSquare,
      title: "Technical Support",
      description:
        "Experiencing issues with the platform? Our technical team is here to help you resolve any problems.",
      link: "#contact-form",
      linkText: "Get technical support",
    },
    {
      icon: HelpCircle,
      title: "General Inquiries",
      description:
        "Have other questions about IntelAcad? We're here to assist with any general inquiries you may have.",
      link: "#contact-form",
      linkText: "Contact us",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* How can we help section */}
      <section className="bg-cyan-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">How can we help?</h1>
            <p className="text-lg text-cyan-50 max-w-2xl mx-auto text-balance">
              Reach out to us for any internship queries, platform support, or career guidance. We're here to help you
              succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {helpOptions.map((option, index) => {
              const Icon = option.icon
              return (
                <Card key={index} className="bg-white text-foreground hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                      <Icon className="h-8 w-8 text-cyan-800" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow leading-relaxed">{option.description}</p>
                    <a
                      href={option.link}
                      onClick={scrollToForm}
                      className="text-sm text-cyan-800 hover:text-cyan-700 font-medium inline-flex items-center cursor-pointer"
                    >
                      {option.linkText} →
                    </a>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <div className="px-8 py-6 border-b bg-background">
                <h2 className="text-2xl font-bold text-center text-foreground">Get in Touch</h2>
              </div>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-foreground">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-foreground">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-foreground">
                      Reason for Contact
                    </Label>
                    <Select
                      value={formData.reason}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, reason: value }))}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Choose your reason for contacting us" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internship">Internship Query</SelectItem>
                        <SelectItem value="application">Application Support</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="career">Career Guidance</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="bg-background min-h-[120px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-cyan-800 hover:bg-cyan-700 text-white"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <Toaster />
    </div>
  )
}
