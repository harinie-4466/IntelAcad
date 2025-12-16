import asyncHandler from 'express-async-handler'
import Journey from '../models/Journey'
import User from '../models/User'

export const getJourney = asyncHandler(async (req: any, res) => {
  const userId = req.user?._id
  if (!userId) return res.status(401).json({ message: 'Not authorized' })

  let journey = await Journey.findOne({ user: userId }).lean()
  if (!journey) {
    return res.json({ navigatorJourneyComplete: false, journeyData: {}, journeyDataByStream: {} })
  }

  res.json({
    navigatorJourneyComplete: journey.navigatorJourneyComplete,
    journeyData: journey.journeyData || {},
    journeyDataByStream: journey.journeyDataByStream || {},
    personalizedRoadmap: journey.personalizedRoadmap || {},
  })
})

export const upsertJourney = asyncHandler(async (req: any, res) => {
  const userId = req.user?._id
  if (!userId) return res.status(401).json({ message: 'Not authorized' })

  const { navigatorJourneyComplete, journeyData, journeyDataByStream, personalizedRoadmap, journeyInput } = req.body

  const update: any = {}
  if (typeof navigatorJourneyComplete !== 'undefined') update.navigatorJourneyComplete = navigatorJourneyComplete
  if (typeof journeyData !== 'undefined') update.journeyData = journeyData
  if (typeof journeyDataByStream !== 'undefined') update.journeyDataByStream = journeyDataByStream

  // Helper: simple server-side fallback roadmap generator
  const generateRoadmapFromInput = (input: any) => {
    const { careerGoal, domains = [], academicStage, skillLevel = 'intermediate', commitmentHours = 10, shortTermGoals } = input || {}
    const courseBank: Record<string, string[]> = {
      fullstack: [
        'HTML & CSS Basics', 'JavaScript Fundamentals', 'Responsive Design', 'React.js Essentials',
        'State Management', 'Next.js Framework', 'TypeScript', 'Node.js & Express', 'RESTful APIs',
        'Database Design', 'Authentication & Security', 'Testing & Debugging', 'Deployment & CI/CD'
      ],
      'ai-ml': [
        'Python Programming', 'Mathematics for ML', 'Statistics & Probability', 'Data Manipulation with Pandas',
        'Machine Learning Fundamentals', 'Model Evaluation', 'Deep Learning Basics', 'Neural Networks',
        'Computer Vision Basics', 'NLP Basics', 'MLOps & Deployment'
      ],
      mobile: [
        'Mobile UI/UX Principles', 'React Native Basics', 'State Management for Mobile', 'Native Modules & Performance',
        'iOS Fundamentals (Swift)', 'Android Fundamentals (Kotlin)', 'Testing & Deployment'
      ],
      devops: [
        'Linux Fundamentals', 'Networking Basics', 'Git & Version Control', 'Docker & Containerization',
        'CI/CD', 'Kubernetes Basics', 'Cloud Fundamentals', 'Infrastructure as Code'
      ],
    }

    const roadmap: any = { summary: { careerGoal, domains, academicStage, skillLevel, commitmentHours, shortTermGoals }, streams: {} }
    const mapDomain = (d: string) => {
      const key = (d || '').toLowerCase()
      if (key.includes('web') || key.includes('full')) return 'fullstack'
      if (key.includes('mobile')) return 'mobile'
      if (key.includes('machine') || key.includes('data') || key.includes('ai')) return 'ai-ml'
      if (key.includes('cloud') || key.includes('devops')) return 'devops'
      return 'fullstack'
    }

    domains.forEach((d: string) => {
      const sid = mapDomain(d)
      const courses = courseBank[sid] || []
      const foundation = courses.slice(0, Math.max(2, Math.floor(courses.length * 0.2)))
      const core = courses.slice(foundation.length, Math.max(foundation.length + 3, Math.floor(courses.length * 0.6)))
      const advanced = courses.slice(foundation.length + core.length, foundation.length + core.length + 3)
      const projects = ['Capstone Project', 'Interview Prep & Mock Interviews']

      roadmap.streams[sid] = { name: d, phases: [
        { phase: 'Foundation', items: foundation },
        { phase: 'Core Skills', items: core },
        { phase: 'Advanced Topics', items: advanced },
        { phase: 'Projects & Prep', items: projects },
      ], courses }
    })

    return roadmap
  }

  // If client provided a roadmap, accept it; else if client sent journeyInput, attempt to get roadmap from Deepseek or generate fallback
  if (personalizedRoadmap) {
    update.personalizedRoadmap = personalizedRoadmap
  } else if (journeyInput) {
    // Try Deepseek integration if configured
    const deepseekUrl = process.env.DEEPSEEK_API_URL
    const deepseekKey = process.env.DEEPSEEK_API_KEY
    if (deepseekUrl) {
      try {
        const resp = await fetch(deepseekUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(deepseekKey ? { Authorization: `Bearer ${deepseekKey}` } : {}),
          },
          body: JSON.stringify({ input: journeyInput }),
        })
        if (resp.ok) {
          const ds = await resp.json().catch(() => ({}))
          // Expect the external API to return an object with a `roadmap` field or the roadmap itself
          update.personalizedRoadmap = ds.roadmap || ds
        } else {
          // fallback
          update.personalizedRoadmap = generateRoadmapFromInput(journeyInput)
        }
      } catch (err) {
        console.error('[journeyController] Deepseek call failed', err)
        update.personalizedRoadmap = generateRoadmapFromInput(journeyInput)
      }
    } else {
      // No Deepseek configured: generate roadmap locally
      update.personalizedRoadmap = generateRoadmapFromInput(journeyInput)
    }
  }
  if (typeof personalizedRoadmap !== 'undefined') update.personalizedRoadmap = personalizedRoadmap

  const result = await Journey.findOneAndUpdate(
    { user: userId },
    { $set: update, $setOnInsert: { user: userId } },
    { upsert: true, new: true }
  )

  // also mirror a summary flag on user.profile.navigatorJourneyComplete for quick checks
  if (typeof navigatorJourneyComplete !== 'undefined') {
    await User.findByIdAndUpdate(userId, { $set: { 'profile.navigatorJourneyComplete': navigatorJourneyComplete } })
  }

  res.json({ success: true, journey: result })
})
