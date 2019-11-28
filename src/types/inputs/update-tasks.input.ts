import { inputObjectType } from 'nexus'

export const UpdateTasksInput = inputObjectType({
  name: 'UpdateTasksInput',
  definition(t) {
    t.list.field('tasks', { type: 'UpdateTaskInput', required: true })
  }
})
