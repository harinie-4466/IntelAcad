import Link from "next/link"
import { Instagram, Linkedin, Twitter, Facebook, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-cyan-900 via-cyan-800 to-cyan-900 border-t border-cyan-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
          {/* Student Features */}
          <div>
            <h3 className="font-semibold text-white mb-4">For Students</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/student/navigator" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Journey Navigator
                </Link>
              </li>
              <li>
                <Link
                  href="/student/certifications"
                  className="text-sm text-cyan-100 hover:text-white transition-colors"
                >
                  Certifications
                </Link>
              </li>
              <li>
                <Link href="/student/internships" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Internships
                </Link>
              </li>
              <li>
                <Link href="/student/resume" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/student/assessments" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Assessments
                </Link>
              </li>
            </ul>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold text-white mb-4">Skills</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Artificial Intelligence (AI)
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Cybersecurity
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Data Analytics
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Cloud Computing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Machine Learning
                </Link>
              </li>
            </ul>
          </div>

          {/* Certificates & Programs */}
          <div>
            <h3 className="font-semibold text-white mb-4">Certificates & Programs</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Google Cybersecurity Certificate
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Google Data Analytics Certificate
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  AWS Cloud Practitioner
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  IBM Data Science Certificate
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Machine Learning Certificate
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Full Stack Development
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries & Careers */}
          <div>
            <h3 className="font-semibold text-white mb-4">Industries & Careers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Software Engineering
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Data Science
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Computer Science
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Information Technology (IT)
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Cybersecurity
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Cloud Architecture
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  DevOps Engineering
                </Link>
              </li>
            </ul>
          </div>

          {/* Career Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Career Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Career Test
                </Link>
              </li>
              <li>
                <Link href="/student/resume" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Interview Preparation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Salary Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Job Search Tips
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Portfolio Examples
                </Link>
              </li>
            </ul>
          </div>

          {/* IntelAcad */}
          <div>
            <h3 className="font-semibold text-white mb-4">IntelAcad</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Leadership
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/company" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  For Companies
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  For Administrators
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & More */}
          <div>
            <h3 className="font-semibold text-white mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Learners
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Beta Testers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Tech Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-cyan-100 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cyan-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-cyan-100">© 2025 IntelAcad Inc. All rights reserved.</p>

            <div className="flex items-center space-x-4">
              <a href="#" className="text-cyan-100 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-cyan-100 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-cyan-100 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-cyan-100 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-cyan-100 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
