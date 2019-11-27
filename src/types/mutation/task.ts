import { extendType, arg } from 'nexus'

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

        const updatedUser = await db.User.findByIdAndUpdate(
          userId,
          {
            $push: { tasks: { rank, description } }
          },
          { new: true }
        )

        return updatedUser!.tasks[rank - 1]
      }
    })
  }
})
