import { Schema, Document, model, Model } from 'mongoose'

export interface ITask extends Document {
  id: string
  rank: number
  description: string
  completed: boolean
  date: Date
}

export const TaskSchema: Schema = new Schema({
  rank: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    required: true
  }
})

export type TaskModel = Model<ITask>

export const Task = model<ITask>('Task', TaskSchema)
