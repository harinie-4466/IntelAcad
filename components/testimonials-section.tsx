import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    quote:
      "IntelAcad was rated the most popular online course or certification program for learning how to code according to StackOverflow's 2023 Developer survey.",
    author: "StackOverflow Survey",
    role: "37,076 responses collected",
    image: "/stackoverflow-logo.png",
    link: "View Web Development courses",
  },
  {
    quote:
      "IntelAcad was truly a game-changer and a great guide for me as we brought our vision to life through structured learning.",
    author: "Alvin Lim",
    role: "Technical Co-Founder, CTO at Dimensional",
    image: "/professional-asian-male-headshot.png",
    link: "View this iOS & Swift course",
  },
  {
    quote:
      "IntelAcad gives you the ability to be persistent. I learned exactly what I needed to know in the real world. It helped me sell myself to get a new role.",
    author: "William A. Wachlin",
    role: "Partner Account Manager at Amazon Web Services",
    image: "/professional-male-headshot.png",
    link: "View this AWS course",
  },
  {
    quote:
      "With IntelAcad, employees were able to marry the two together, technology and consultant soft skills... to help drive their careers forward.",
    author: "Ian Stevens",
    role: "Head of Capability Development, North America at Publicis Sapient",
    image: "/professional-male-headshot-glasses.jpg",
    link: "Read full story",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Join others transforming their lives through learning
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-cyan-800 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed text-sm">{testimonial.quote}</p>
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{testimonial.author}</p>
                    <p className="text-xs text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <a href="#" className="text-cyan-800 hover:text-cyan-700 text-sm font-medium">
                  {testimonial.link} →
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
