import { GraphQLServer, Options } from 'graphql-yoga'
import { formatError } from 'apollo-errors'
import next from 'next'

import { schema } from './schema'
import { createContext } from './context'

const port = process.env.PORT || 4000
const dev = process.env.NODE_ENV !== 'production'
const gqlEndpoint = '/graphql'
const playgroundEndpoint = '/playground'

async function main() {
  const options: Options = {
    formatError,
    endpoint: gqlEndpoint,
    playground: playgroundEndpoint,
    getEndpoint: true
  }

  const server = new GraphQLServer({ schema, context: createContext })

  const client = next({ dev, dir: './src/client' })
  const handle = client.getRequestHandler()
  client.prepare()

  server.use((req: any, res: any, next: any) => {
    return req.path.startsWith(gqlEndpoint) ||
      req.path.startsWith(playgroundEndpoint)
      ? next()
      : handle(req, res)
  })

  server.start(options, () =>
    console.log(`🚀 Server ready at: http://localhost:${port}`)
  )
}

main()
