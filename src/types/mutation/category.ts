import { extendType, arg } from 'nexus'

export const CategoryMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createCategory', {
      type: 'Category',
      args: {
        data: arg({ type: 'CreateCategoryInput', required: true })
      },
      resolve: async (_, { data }, { db, request }) => {
        const {
          body: { userId }
        } = request

        const { name } = data

        const category = await db.Category.create({ name })

        await db.User.findByIdAndUpdate(userId, {
          $push: { categories: category }
        })

        return category
      }
    }),
      t.field('updateCategory', {
        type: 'Category',
        args: {
          data: arg({ type: 'UpdateCategoryInput', required: true })
        },
        resolve: async (_, { data }, { db, request }) => {
          const { name, categoryId } = data

          const category = await db.Category.findByIdAndUpdate(
            categoryId,
            {
              name
            },
            { new: true }
          ).populate({
            path: 'tasks',
            option: { sort: { rank: 'asc' } }
          })

          return category!
        }
      })
  }
})
