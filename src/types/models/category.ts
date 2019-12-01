import { objectType } from 'nexus'

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.id('id')
    t.string('name')
    t.list.field('tasks', { type: 'Task' })
  }
})
