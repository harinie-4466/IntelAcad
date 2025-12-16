import { Card } from "@/components/ui/card"
import { BookOpen, Briefcase, Target, TrendingUp, Award, MessageCircle } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: Target,
    title: "Career Explorer",
    description:
      "Discover top CSE roles with salary insights, required skills, and growth opportunities tailored to your interests. Get detailed job descriptions, career progression paths, and industry-specific guidance to make informed decisions about your future. Compare different roles and understand what it takes to succeed in each field.",
    image: "/professional-exploring-career-opportunities.jpg",
    imageAlt: "Professional exploring career opportunities on laptop",
  },
  {
    icon: TrendingUp,
    title: "Trending Skills Dashboard",
    description:
      "Stay updated with real-time industry demands and in-demand technologies like AI, Cloud, and DevOps. Track emerging technologies, monitor skill popularity trends, and understand which competencies are most valued by employers. Get insights into salary correlations and job market dynamics to prioritize your learning effectively.",
    image: "/dashboard-showing-trending-technology-skills.jpg",
    imageAlt: "Dashboard showing trending technology skills and analytics",
  },
  {
    icon: Award,
    title: "Certifications Guide",
    description:
      "Curated list of valuable certifications with reviews, costs, and career impact analysis. Access detailed information about certification providers, exam formats, preparation resources, and success rates. Read authentic student reviews and understand the ROI of each certification to make smart investment decisions in your professional development.",
    image: "/professional-certifications-guide.jpg",
    imageAlt: "Student reviewing professional certifications on tablet",
  },
  {
    icon: BookOpen,
    title: "Learning Paths",
    description:
      "Structured roadmaps from beginner to advanced levels across different CSE domains. Follow step-by-step learning journeys designed by industry experts, with clear milestones and progress tracking. Access curated resources, practice projects, and assessment tools to ensure you're building the right skills in the right order.",
    image: "/interactive-learning-roadmap.jpg",
    imageAlt: "Interactive learning roadmap visualization",
  },
  {
    icon: Briefcase,
    title: "Internship Hubs",
    description:
      "Access curated internship opportunities from top companies, with application tips and interview preparation resources. Get insider insights into company cultures, application processes, and selection criteria. Prepare with mock interviews, resume templates, and success stories from students who secured positions at leading tech companies.",
    image: "/professional-internship-environment.jpg",
    imageAlt: "Students collaborating in professional internship environment",
  },
  {
    icon: MessageCircle,
    title: "AI Career Assistant",
    description:
      "Get personalized career advice and answers to your questions with our intelligent chatbot. Receive instant guidance on course selection, skill development, career transitions, and job search strategies. Ask anything about your career journey and get contextual, actionable recommendations powered by advanced AI technology.",
    image: "/ai-chatbot-career-guidance.jpg",
    imageAlt: "AI chatbot providing personalized career guidance",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">Everything you need to succeed</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Comprehensive tools and resources designed specifically for Computer Science students to navigate their
            career journey.
          </p>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => {
            const isEven = index % 2 === 0
            return (
              <Card
                key={index}
                className="overflow-hidden bg-card hover:shadow-xl transition-shadow duration-300 border-0"
              >
                <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-0`}>
                  {/* Image Side */}
                  <div className="w-full lg:w-1/2 relative h-[250px] lg:h-[320px]">
                    <Image
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>

                  {/* Content Side */}
                  <div className="w-full lg:w-1/2 p-6 lg:p-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold text-balance">{feature.title}</h3>
                    </div>
                    <p className="text-sm lg:text-base text-muted-foreground leading-relaxed text-pretty">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
