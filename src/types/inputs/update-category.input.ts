import { inputObjectType } from 'nexus'

export const UpdateCategoryInput = inputObjectType({
  name: 'UpdateCategoryInput',
  definition(t) {
    t.id('categoryId', { required: true })
    t.string('name', { required: true })
  }
})
