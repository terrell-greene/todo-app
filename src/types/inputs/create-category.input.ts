import { inputObjectType } from 'nexus'

export const CreateCategoryInput = inputObjectType({
  name: 'CreateCategoryInput',
  definition(t) {
    t.string('name', { required: true })
  }
})
