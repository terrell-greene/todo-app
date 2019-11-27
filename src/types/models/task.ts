import { objectType } from 'nexus'

export const Task = objectType({
  name: 'Task',
  definition(t) {
    t.string('id')
    t.int('rank')
    t.string('description')
    t.boolean('completed')
  }
})
