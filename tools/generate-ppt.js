const PptxGenJS = require('pptxgenjs')
const path = require('path')

const slides = [
  {
    title: 'IntelAcad — Project Overview',
    bullets: [
      'Career-guidance and internship platform connecting students, companies and admins.',
      'Frontend: Next.js + React + TypeScript; Backend: Node/Express + TypeScript + MongoDB.',
      'Key features: auth, profile setup, Journey Navigator, company registration & internships, admin analytics.'
    ]
  },
  {
    title: 'Modules & Contributions',
    bullets: [
      'Authentication — backend routes/controllers',
      'Profile Setup (student) — frontend + profile API',
      'Journey Navigator — frontend navigator + backend journey controller',
      'Dashboard & Visuals — frontend charts and UI primitives',
      'Company Portal & Internships — company routes and controllers',
      '(Replace placeholder owners with actual contributor names)'
    ]
  },
  {
    title: 'Users & Needs',
    bullets: [
      'Students: create roadmap, track courses, find internships, manage profile',
      'Companies: register, manage profile, post internships, view applicants',
      'Admins: monitor analytics, approvals, user management'
    ]
  },
  {
    title: 'Visualizations & Actions',
    bullets: [
      'Progress bars and roadmap visual per stream (student dashboard)',
      'Recharts-based analytics for admin (pie, bar, area charts)',
      'Actions: submit journey → POST /api/journey, toggle courses (local→merge), manage internships'
    ]
  },
  {
    title: 'Tech Stack',
    bullets: [
      'Frontend: Next.js (App Router), React 19, TypeScript, TailwindCSS, Radix UI',
      'Backend: Node.js + Express + TypeScript, Mongoose + MongoDB',
      'Charts: Recharts; Auth: JWT; Dev: pnpm, tsc, ESLint'
    ]
  },
  {
    title: 'Working Flow',
    bullets: [
      'User interacts with Next.js frontend → API calls to Express backend',
      'Backend updates MongoDB (users, companies, journeys, internships)',
      'Server persists personalizedRoadmap; frontend merges local toggles on load',
      'JWT stored in localStorage and used as Authorization header'
    ]
  },
  {
    title: 'Key Takeaways & Status',
    bullets: [
      'Server is single source-of-truth for personalized roadmaps',
      'Hydration and JSON parse error handling improvements applied',
      "Repo has some TypeScript diagnostics to triage (charts/controllers/types)",
      'Next steps: fix TSC errors, add e2e tests, create QA collection'
    ]
  },
  {
    title: 'Testing & QA',
    bullets: [
      'Manual tests: Thunder Client / Postman for auth, profile, journey, company endpoints',
      'Unit tests: Jest/Vitest for backend controllers (mock Mongoose)',
      'E2E: Playwright/Cypress for register→profile→journey flows',
      'Included test data: test-data/company-register.json'
    ]
  }
]

function addBulletText(slide, lines) {
  const options = {
    x: 0.5,
    y: 1.5,
    w: '89%',
    h: '70%',
    color: '363636',
    fontSize: 16,
    bullet: true,
    margin: 0.05
  }
  // pptxgenjs expects a string or array of text objects; join lines into a single newline string
  const text = lines.join('\n')
  slide.addText(text, options)
}

async function generate() {
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'

  // Title slide with text logo
  const titleSlide = pptx.addSlide()
  titleSlide.background = { color: 'F7FBFF' }
  titleSlide.addText('IntelAcad', { x: 0.5, y: 0.7, w: '90%', align: 'center', fontSize: 40, bold: true, color: '0A3D62' })
  titleSlide.addText('Project Overview', { x: 0.5, y: 1.8, w: '90%', align: 'center', fontSize: 18, color: '1F3A93' })

  // Content slides
  for (const s of slides) {
    const slide = pptx.addSlide()
    slide.addText(s.title, { x: 0.5, y: 0.3, w: '90%', fontSize: 24, bold: true, color: '0A3D62' })
    addBulletText(slide, s.bullets)
  }

  const outPath = path.resolve(process.cwd(), 'intelacad-presentation.pptx')
  await pptx.writeFile({ fileName: outPath })
  console.log('Presentation created at:', outPath)
}

generate().catch(err => {
  console.error('Failed to generate presentation:', err)
  process.exit(1)
})
