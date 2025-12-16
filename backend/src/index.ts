import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import connectDB from './lib/db'
import authRoutes from './routes/auth'
import feedbackRoutes from './routes/feedback'
import profileRoutes from './routes/profile'
import journeyRoutes from './routes/journey'
import debugRoutes from './routes/debug'
import contactRoutes from './routes/contact'
import companyRoutes from './routes/company'
import companyContactRoutes from './routes/companyContact'
import internshipRoutes from './routes/internship'

dotenv.config()

const app = express()
app.use(cors())

// JSON body parser with global parse-error handler
app.use(express.json())

// If body-parser throws a SyntaxError (malformed JSON), return a clean 400 JSON response
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof SyntaxError && 'body' in err) {
    console.warn('Malformed JSON payload received:', err.message)
    return res.status(400).json({ message: 'Invalid JSON payload' })
  }
  next()
})

app.use(morgan('dev'))

const PORT = process.env.PORT || 5000

connectDB()

app.use('/api/auth', authRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/journey', journeyRoutes)
app.use('/api/debug', debugRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/company', companyRoutes)
app.use('/api/company/contact', companyContactRoutes)
app.use('/api/internships', internshipRoutes)

app.get('/', (req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
