"use client"

import { StudentHeader } from "@/components/student-header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Award, Target, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function SuccessStories() {
  const stories = [
    {
      id: 1,
      name: "Rahul Sharma",
      image: "/man1.jpeg",
      company: "Google",
      role: "Software Engineer",
      achievement: "Increased Problem Solving Skills by 85%",
      assessmentsCompleted: 156,
      story:
        "After completing 156 assessments on IntelAcad, I significantly improved my problem-solving abilities and landed my dream job at Google. The platform's curated challenges helped me identify my weak areas and work on them systematically.",
      tags: ["DSA", "Algorithms", "System Design"],
    },
    {
      id: 2,
      name: "Priya Patel",
      image: "/woman1.jpeg",
      company: "Microsoft",
      role: "Data Scientist",
      achievement: "Boosted Confidence by 90%",
      assessmentsCompleted: 142,
      story:
        "The regular practice on IntelAcad built my confidence tremendously. I went from being nervous about technical interviews to acing them with ease. The variety of assessments prepared me for any question that came my way.",
      tags: ["Data Science", "ML", "Statistics"],
    },
    {
      id: 3,
      name: "Amit Kumar",
      image: "/man4.jpeg",
      company: "Amazon",
      role: "Backend Developer",
      achievement: "Improved Coding Speed by 75%",
      assessmentsCompleted: 138,
      story:
        "IntelAcad's timed assessments taught me to think and code faster without compromising on quality. This skill was crucial during my Amazon interviews where I had to solve complex problems under time pressure.",
      tags: ["Backend", "APIs", "Databases"],
    },
    {
      id: 4,
      name: "Sneha Reddy",
      image: "/woman7.jpeg",
      company: "Meta",
      role: "Frontend Engineer",
      achievement: "Mastered Interview Patterns",
      assessmentsCompleted: 125,
      story:
        "The diverse range of problems on IntelAcad exposed me to all common interview patterns. By the time I interviewed at Meta, I had seen similar problems and knew exactly how to approach them.",
      tags: ["React", "JavaScript", "UI/UX"],
    },
    {
      id: 5,
      name: "Vikram Singh",
      image: "/man6.jpg",
      company: "Apple",
      role: "iOS Developer",
      achievement: "Secured Top 1% Ranking",
      assessmentsCompleted: 118,
      story:
        "Competing on the leaderboard motivated me to push my limits. I went from struggling with basic problems to ranking in the top 1%. This journey prepared me perfectly for Apple's rigorous interview process.",
      tags: ["iOS", "Swift", "Mobile Dev"],
    },
    {
      id: 6,
      name: "Anjali Verma",
      image: "/woman3.jpeg",
      company: "Netflix",
      role: "Full Stack Developer",
      achievement: "Landed Dream Job in 3 Months",
      assessmentsCompleted: 95,
      story:
        "Within just 3 months of consistent practice on IntelAcad, I transformed from a college student to a Netflix engineer. The platform's structured approach and real-world challenges made all the difference.",
      tags: ["Full Stack", "Node.js", "React"],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StudentHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="relative bg-gradient-to-br from-cyan-900 via-cyan-700 to-purple-600 py-24 px-4"
          style={{
            backgroundImage: "url('/success-hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/90 via-blue-600/90 to-purple-600/90" />
          <div className="container mx-auto max-w-6xl text-center relative z-10">
            <Award className="h-16 w-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">SUCCESS STORIES</h1>
            <p className="text-xl text-white/90 mb-4 max-w-3xl mx-auto">
              IntelAcad was used by a power team of designers and the return with a proven track record of the highest
              returns on homes and apartments
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Real students, real results. See how our platform helped them achieve their career goals.
            </p>
          </div>
        </section>

        {/* Success Stories Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Successful Projects</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Throughout California, we have a track of successful projects and satisfied clients. We have increased
                the value of their properties with innovative ideas and expert execution.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <Card key={story.id} className="overflow-hidden hover:shadow-xl transition-all group">
                  <div className="relative h-48 bg-gradient-to-br from-cyan-100 to-blue-100">
                    <Image
                      src={story.image || "/placeholder.svg"}
                      alt={story.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg">{story.name}</h3>
                      <p className="text-white/90 text-sm">
                        {story.role} at {story.company}
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <Badge className="bg-green-100 text-green-800 mb-3">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {story.achievement}
                    </Badge>
                    <div className="mb-3">
                      <p className="text-2xl font-bold text-cyan-600">{story.assessmentsCompleted}</p>
                      <p className="text-sm text-gray-600">Assessments Completed</p>
                    </div>
                    <p className="text-sm text-gray-700 mb-4 line-clamp-4">{story.story}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {story.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-cyan-600 to-blue-600 py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-white" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Write Your Success Story?</h2>
            <p className="text-cyan-100 mb-8 text-lg">
              Join thousands of students who have transformed their careers with IntelAcad
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/student/assessments">Start Practicing Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10"
                asChild
              >
                <Link href="/student/assessments/completed">View My Progress</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
