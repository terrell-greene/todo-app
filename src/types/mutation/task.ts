import { extendType, arg } from 'nexus'
import { ITask } from '../../db'
import { asyncForEach } from '../../utils'

export const TaskMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createTask', {
      type: 'Task',
      args: {
        data: arg({ type: 'CreateTaskInput', required: true })
      },
      resolve: async (_, { data }, { db, request }) => {
        const { description } = data
        const {
          body: { userId }
        } = request

        const user = await db.User.findById(userId).select('tasks')

        const rank = user!.tasks.length + 1

        const task = await db.Task.create({ rank, description })

        await db.User.findByIdAndUpdate(userId, {
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
  }
})
