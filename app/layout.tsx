import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Quantico } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import ChatbotClient from '@/components/chatbot-client'

const quantico = Quantico({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-quantico",
})

export const metadata: Metadata = {
  title: "IntelAcad - Where Streams meet Strategies",
  description:
    "A comprehensive career navigator platform for CSE students to explore skills, certifications, and career paths.",
  generator: "vscode",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${quantico.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
  <ChatbotClient />
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
