import { makeSchema } from 'nexus'
import * as path from 'path'
import * as types from './types'

export const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(__dirname, 'schema.graphql')
  },
  typegenAutoConfig: {
    sources: [
      // {
      //   source: require.resolve('./db'),
      //   alias: 'db'
      // },
      {
        source: require.resolve('./context'),
        alias: 'Context'
      }
    ],
    contextType: 'Context.Context'
  }
})
