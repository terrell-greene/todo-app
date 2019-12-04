import { extendType, arg } from 'nexus'
import { ITask } from '../../db'
import { asyncForEach } from '../../utils'
import { CreateCategoryError, DeleteTaskError } from '../../errors'

export const TaskMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createTask', {
      type: 'Task',
      args: {
        data: arg({ type: 'CreateTaskInput', required: true })
      },
      resolve: async (_, { data }, { db, request }) => {
        const { description, categoryId, date } = data
        const {
          body: { userId }
        } = request

        const category = await db.Category.findById(categoryId).select('tasks')

        if (!category) {
          throw new CreateCategoryError({
            data: {
              categoryId: "A category by that id doesn't exist"
            }
          })
        }
        const rank = category.tasks.length + 1

        const task = await db.Task.create({ rank, description, date })

        await db.Category.findByIdAndUpdate(categoryId, {
          $push: { tasks: task }
        })

        return task
      }
    })

    t.list.field('updateTasks', {
      type: 'Task',
      args: {
        data: arg({ type: 'UpdateTasksInput', required: true })
      },
      resolve: async (_, { data }, { db }) => {
        const updatedTasks: ITask[] = []

        await asyncForEach(data.tasks, async task => {
          const updatedTask = await db.Task.findByIdAndUpdate(task.id, task, {
            new: true
          })

          updatedTasks.push(updatedTask!)
        })

        return updatedTasks
      }
    })

    t.field('deleteTask', {
      type: 'Boolean',
      args: {
        data: arg({ type: 'DeleteTaskInput', required: true })
      },
      resolve: async (_, { data }, { db }) => {
        const { categoryId, taskId } = data

        try {
          await db.Category.findByIdAndUpdate(categoryId, {
            $pull: { tasks: taskId }
          })

          await db.Task.findByIdAndDelete(taskId)

          return true
        } catch (error) {
          throw new DeleteTaskError()
        }
      }
    })
  }
})
