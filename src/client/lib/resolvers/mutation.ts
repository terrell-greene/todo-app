import { Context } from './utils'

export default {
  test: async (_, args, { cache }: Context) => {
    return 'test mutation'
  }
}
