import { Schema, Document, model } from 'mongoose'

export interface IUser extends Document {
  email: string
  name: string
  password: string
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  name: { type: String, required: true },
  password: { type: String, required: true }
})

export const User = model<IUser>('User', UserSchema)
