import { Context } from './utils'
import gql from 'graphql-tag'

export default {
  clientTest: async (_, args, { cache }: Context) => {
    return 'Query from the client!'
  },
  getCache: async (_, args, { cache }: Context) => {
    const query = gql`
      query {
        auth @client
      }
    `

    try {
      const res = await cache.readQuery({ query })

      return res
    } catch (error) {
      console.log(error)
    }

    return 'cache Query'
  }
}
