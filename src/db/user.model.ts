import { Schema, Document, model } from 'mongoose'
import { TaskSchema, ITask } from './task.model'

export interface IUser extends Document {
  id: string
  role: 'USER' | 'DEVELOPER'
  email: string
  name: string
  password: string
  tasks: ITask[]
}

const UserSchema: Schema = new Schema({
  role: {
    type: String,
    required: true,
    enum: ['USER', 'DEVELOPER'],
    default: 'USER'
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  name: { type: String, required: true },
  password: { type: String, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
})

export const User = model<IUser>('User', UserSchema)
