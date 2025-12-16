import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { ContactSection } from "@/components/contact-section"
import { CTASection } from "@/components/cta-section"
import { FeedbackSection } from "@/components/feedback-section"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <ContactSection />
        <CTASection />
        <FeedbackSection />
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
