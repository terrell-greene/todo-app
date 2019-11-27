import { Schema, Document, model } from 'mongoose'

export interface ITask extends Document {
  id: string
  rank: number
  description: string
  completed: boolean
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
  }
})

export const Task = model<ITask>('Task', TaskSchema)
