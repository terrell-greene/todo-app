import { queryType } from 'nexus'

export const Query = queryType({
  definition(t) {
    t.field('user', {
      type: 'User',
      resolve: async (_, args, { db, request }) => {
        const {
          body: { userId }
        } = request

        const user = await db.User.findById(userId).populate({
          path: 'tasks',
          options: { sort: { rank: 'asc' } }
        })

        return user!
      }
    })

    t.list.field('users', {
      type: 'User',
      resolve: async (_, args, ctx) => {
        return ctx.db.User.find().populate({
          path: 'tasks',
          options: { sort: { rank: 'asc' } }
        })
      }
    })

    t.list.field('tasks', {
      type: 'Task',
      resolve: async (_, args, ctx) => {
        return ctx.db.Task.find()
      }
    })
  }
})
