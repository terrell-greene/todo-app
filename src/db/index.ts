import { Model } from 'mongoose'

import { IUser } from './user.model'
import { ITask } from './task.model'

export * from './user.model'
export * from './task.model'

export interface IDB {
  User: Model<IUser>
  Task: Model<ITask>
}
