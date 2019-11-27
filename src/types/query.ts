import { queryType } from 'nexus'

export const Query = queryType({
  definition(t) {
    t.string('hello', { resolve: () => 'Hello from the api' })

    t.list.field('users', {
      type: 'User',
      resolve: (_, args, ctx) => {
        return ctx.db.User.find()
      }
    })
  }
})
