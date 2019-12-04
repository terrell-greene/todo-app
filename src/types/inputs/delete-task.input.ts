import { inputObjectType } from 'nexus'

export const DeleteTaskInput = inputObjectType({
  name: 'DeleteTaskInput',
  definition(t) {
    t.id('categoryId', { required: true })
    t.id('taskId', { required: true })
  }
})
