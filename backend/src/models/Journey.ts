import { Schema, model } from 'mongoose'

export interface IJourneyByStream {
  coursesCompleted: string[]
  learningGoal: string
  skills: Array<{ id: string; name: string; level: string }>
  projects: Array<{ id: string; name: string; description: string; technologies: string }>
  targetDate: string
  notes: string
}

export interface IJourney {
  user: any
  navigatorJourneyComplete?: boolean
  journeyData?: Record<string, any>
  journeyDataByStream?: Record<string, IJourneyByStream>
  personalizedRoadmap?: any
}

const journeyByStreamSchema = new Schema<IJourneyByStream>({
  coursesCompleted: { type: [String], default: [] },
  learningGoal: { type: String, default: '' },
  skills: { type: [{ id: String, name: String, level: String }], default: [] },
  projects: { type: [{ id: String, name: String, description: String, technologies: String }], default: [] },
  targetDate: { type: String, default: '' },
  notes: { type: String, default: '' },
})

const journeySchema = new Schema<IJourney>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  navigatorJourneyComplete: { type: Boolean, default: false },
  journeyData: { type: Schema.Types.Mixed, default: {} },
  journeyDataByStream: { type: Map, of: journeyByStreamSchema, default: {} },
  personalizedRoadmap: { type: Schema.Types.Mixed, default: {} },
})

export default model<IJourney>('Journey', journeySchema)
