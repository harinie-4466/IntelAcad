import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const roles = [
  {
    title: "Data Analyst",
    description:
      "A Data Analyst collects, cleans, and interprets data, using tools like Excel, SQL, and Tableau to analyze trends and provide insights for decisions.",
    salary: "₹302,321",
    companies: ["/udemy-logo.jpg", "/ibm-logo.png", "/google-logo.png"],
    image: "/professional-male-data-analyst-business-attire.jpg",
  },
  {
    title: "Data Scientist",
    description:
      "A Data Scientist analyzes large datasets to uncover insights, using statistics, machine learning, and visualization to inform business strategies.",
    salary: "₹505,348",
    companies: ["/google-logo.png", "/ibm-logo.png", "/microsoft-logo.png"],
    image: "/professional-female-data-scientist-business-casual.jpg",
  },
]

export function ExploreRolesSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Explore roles</h2>
          <p className="text-gray-600 text-lg mb-6">Gain the knowledge and skills you need to advance.</p>
          <Button variant="outline" className="border-cyan-800 text-cyan-800 hover:bg-cyan-50 bg-transparent">
            View all
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {roles.map((role, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{role.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{role.description}</p>
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-cyan-800">
                        {role.salary} <span className="text-sm font-normal text-gray-600">median salary ¹</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Offered by</p>
                      <div className="flex gap-3">
                        {role.companies.map((company, idx) => (
                          <Image
                            key={idx}
                            src={company || "/placeholder.svg"}
                            alt="Company logo"
                            width={60}
                            height={24}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full md:w-64 h-64 md:h-auto bg-gradient-to-br from-yellow-400 to-orange-400">
                    <Image src={role.image || "/placeholder.svg"} alt={role.title} fill className="object-cover" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
