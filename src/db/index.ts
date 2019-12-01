import { UserModel } from './user.model'
import { TaskModel } from './task.model'
import { CategoryModel } from './category.model'

export * from './user.model'
export * from './task.model'
export * from './category.model'

export interface IDB {
  User: UserModel
  Task: TaskModel
  Category: CategoryModel
}
