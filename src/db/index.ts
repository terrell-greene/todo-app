import { Model } from 'mongoose'

import { IUser } from './user.model'

export * from './user.model'

export interface IDB {
  User: Model<IUser>
}
