import { inputObjectType } from 'nexus'

export const CreateTaskInput = inputObjectType({
  name: 'CreateTaskInput',
  definition(t) {
    t.string('description')
  }
})
