import { inputObjectType } from 'nexus'

export const UpdateTaskInput = inputObjectType({
  name: 'UpdateTaskInput',
  definition(t) {
    t.id('id', { required: true })
    t.int('rank')
    t.string('description')
    t.boolean('completed')
  }
})
