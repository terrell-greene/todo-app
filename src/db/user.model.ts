import { Schema, Document, model } from 'mongoose'
import { TaskSchema, ITask } from './task.model'

export interface IUser extends Document {
  id: string
  email: string
  name: string
  password: string
  tasks: ITask[]
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  name: { type: String, required: true },
  password: { type: String, required: true },
  tasks: [TaskSchema]
})

export const User = model<IUser>('User', UserSchema)
