import { inputObjectType } from 'nexus'

export const UpdateTaskInput = inputObjectType({
  name: 'UpdateTaskInput',
  definition(t) {
    t.id('id', { required: true })
    t.int('rank')
    t.datetime('date')
    t.string('description')
    t.boolean('completed')
  }
})
