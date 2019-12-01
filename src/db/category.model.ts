import { Schema, Document, model, Model } from 'mongoose'
import { ITask } from './task.model'

export interface ICategory extends Document {
  id: string
  name: string
  tasks: ITask[]
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
})

export type CategoryModel = Model<ICategory>

export const Category = model<ICategory>('Category', CategorySchema)
