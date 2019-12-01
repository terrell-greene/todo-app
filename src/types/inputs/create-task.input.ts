import { inputObjectType } from 'nexus'

export const CreateTaskInput = inputObjectType({
  name: 'CreateTaskInput',
  definition(t) {
    t.id('categoryId', { required: true })
    t.string('description', { required: true })
    t.datetime('date', { required: true })
  }
})
