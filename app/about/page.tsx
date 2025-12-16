import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, Code2, Rocket, Users, Target } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  const developers = [
    {
      name: "Madhumithraa",
      role: "Full Stack Developer & Project Lead",
      image: "/dev-madhumithraa.jpg",
      bio: "Passionate about creating seamless user experiences and scalable backend systems. Led the architecture and development of IntelAcad's core platform.",
      skills: ["React", "Node.js", "PostgreSQL", "AWS"],
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "madhumithraa@intelacad.com",
    },
    {
      name: "Mayuka Sri",
      role: "Frontend Developer & UI/UX Designer",
      image: "/dev-mayuka.jpg",
      bio: "Specializes in crafting beautiful, intuitive interfaces. Designed and implemented IntelAcad's responsive design system and component library.",
      skills: ["TypeScript", "Next.js", "Tailwind CSS", "Figma"],
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mayuka@intelacad.com",
    },
    {
      name: "Kanishthika",
      role: "Backend Developer & Database Architect",
      image: "/dev-kanishthika.jpg",
      bio: "Expert in building robust APIs and optimizing database performance. Architected IntelAcad's data models and authentication systems.",
      skills: ["Python", "Express.js", "MongoDB", "Redis"],
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "kanishthika@intelacad.com",
    },
    {
      name: "Harinie",
      role: "Full Stack Engineer",
      image: "/harinie.jpg",
      bio: "Ensures IntelAcad runs smoothly. Implemented Resume builder, Assessments and Admin login Pages.",
      skills: ["MongoDB", "React.js", "Postman", "Next.js"],
      github: "https://github.com/harinie-4466",
      linkedin: "https://www.linkedin.com/in/harinie-boopathy-08787b289/",
      email: "sviharinie@gmail.com",
    },
  ]

  const mentor = {
    name: "Senthilkumar T",
    role: "Project Mentor & Technical Advisor",
    image: "/mentor-senthilkumar.jpg",
    bio: "Experienced educator and technology leader guiding the IntelAcad team. Provides strategic direction and technical mentorship to ensure the platform meets industry standards and student needs.",
    skills: ["Software Architecture", "Mentorship", "Project Management", "Technical Leadership"],
    linkedin: "https://linkedin.com",
    email: "senthilkumar@intelacad.com",
  }

  const stats = [
    { icon: <Code2 className="h-8 w-8" />, value: "50,000+", label: "Lines of Code" },
    { icon: <Users className="h-8 w-8" />, value: "10,000+", label: "Active Users" },
    { icon: <Rocket className="h-8 w-8" />, value: "15+", label: "Features Launched" },
    { icon: <Target className="h-8 w-8" />, value: "99.9%", label: "Uptime" },
  ]

  const values = [
    {
      title: "Student-First Approach",
      description:
        "Every feature we build is designed with students' success in mind, ensuring accessibility and ease of use.",
    },
    {
      title: "Innovation & Quality",
      description: "We leverage cutting-edge technologies to deliver a platform that's both powerful and reliable.",
    },
    {
      title: "Continuous Improvement",
      description: "We actively listen to user feedback and iterate rapidly to enhance the platform experience.",
    },
    {
      title: "Open Collaboration",
      description: "We believe in transparent development and fostering a community of learners and contributors.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-800 to-cyan-700 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About IntelAcad</h1>
          <p className="text-xl md:text-2xl text-cyan-100 max-w-3xl mx-auto mb-8">
            Empowering students to achieve their career goals through innovative technology and comprehensive resources
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 text-base">
              Built with ❤️ by Students, for Students
            </Badge>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            IntelAcad was born from a simple observation: students need a centralized platform that combines internship
            opportunities, skill development, career guidance, and assessment tools. We're building that platform—one
            that bridges the gap between academic learning and professional success.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our goal is to democratize access to career resources, making it easier for every student to discover
            opportunities, build their skills, and land their dream job.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Platform Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-2 hover:border-cyan-800 transition-all">
                <CardContent className="pt-8 pb-6">
                  <div className="text-cyan-800 mb-4 flex justify-center">{stat.icon}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Four passionate developers united by a vision to transform student career development
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {developers.map((dev, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-2xl transition-all border-2 hover:border-cyan-800"
              >
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gradient-to-br from-cyan-800 to-cyan-700 flex items-center justify-center p-8">
                    <Image
                      src={dev.image || "/placeholder.svg?height=200&width=200"}
                      alt={dev.name}
                      width={200}
                      height={200}
                      className="rounded-full border-4 border-white shadow-lg"
                    />
                  </div>
                  <CardContent className="md:w-2/3 p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{dev.name}</h3>
                    <p className="text-cyan-800 font-semibold mb-4">{dev.role}</p>
                    <p className="text-gray-700 mb-4 leading-relaxed">{dev.bio}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dev.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-cyan-100 text-cyan-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Button size="sm" variant="outline" asChild>
                        <a href={dev.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`mailto:${dev.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mentor Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mentor</h2>
            <p className="text-lg text-gray-600">Guiding our journey with expertise and wisdom</p>
          </div>

          <Card className="overflow-hidden hover:shadow-2xl transition-all border-2 border-cyan-800">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gradient-to-br from-cyan-800 to-cyan-700 flex items-center justify-center p-8">
                <Image
                  src={mentor.image || "/placeholder.svg?height=250&width=250"}
                  alt={mentor.name}
                  width={250}
                  height={250}
                  className="rounded-full border-4 border-white shadow-lg"
                />
              </div>
              <CardContent className="md:w-2/3 p-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{mentor.name}</h3>
                <p className="text-cyan-800 font-semibold text-lg mb-4">{mentor.role}</p>
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">{mentor.bio}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {mentor.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-cyan-100 text-cyan-800 text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button size="sm" variant="outline" asChild>
                    <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${mentor.email}`}>
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-l-4 border-l-cyan-800 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Built With Modern Technology</h2>
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-bold text-cyan-400 mb-4">Frontend</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Next.js 14</li>
                    <li>• React 18</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• shadcn/ui</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-cyan-400 mb-4">Backend</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Node.js</li>
                    <li>• Express.js</li>
                    <li>• PostgreSQL</li>
                    <li>• MongoDB</li>
                    <li>• Redis</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-cyan-400 mb-4">Infrastructure</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Vercel</li>
                    <li>• AWS</li>
                    <li>• Docker</li>
                    <li>• GitHub Actions</li>
                    <li>• Cloudflare</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-cyan-800 to-cyan-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Us on This Journey</h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Whether you're a student looking to advance your career or a company seeking talented interns, IntelAcad is
            here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/student/register">Get Started as Student</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
              asChild
            >
              <Link href="/company/register">Post Internships</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-8">
            Have questions, feedback, or want to collaborate? We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:team@intelacad.com">
                <Mail className="h-5 w-5 mr-2" />
                team@intelacad.com
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/intelacad" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
