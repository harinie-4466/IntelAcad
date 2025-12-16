export function StatsSection() {
  const stats = [
    { number: "10,000+", label: "Students Guided" },
    { number: "500+", label: "Career Paths" },
    { number: "95%", label: "Success Rate" },
    { number: "50+", label: "Industry Partners" },
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-secondary text-cyan-800 bg-chart-3">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="text-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-sm sm:text-base opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
