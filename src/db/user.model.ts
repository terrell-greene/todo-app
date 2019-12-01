import { Schema, Document, model, Model } from 'mongoose'
import { ICategory } from './category.model'

interface IUser extends Document {
  id: string
  role: 'USER' | 'DEVELOPER'
  username: string
  password: string
  categories: ICategory[]
}

const UserSchema: Schema = new Schema({
  role: {
    type: String,
    required: true,
    enum: ['USER', 'DEVELOPER'],
    default: 'USER'
  },
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: { type: String, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
})

export type UserModel = Model<IUser>

export const User = model<IUser>('User', UserSchema)
