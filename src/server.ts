import { GraphQLServer, Options } from 'graphql-yoga'
import { formatError } from 'apollo-errors'
import * as mongoose from 'mongoose'
import * as redis from 'redis'
import * as bluebird from 'bluebird'
import next from 'next'

import { schema } from './schema'
import { createContext } from './context'
import permissions from './permissions'

const port = process.env.PORT || 4000
const dev = process.env.NODE_ENV !== 'production'
const gqlEndpoint = '/graphql'
const playgroundEndpoint = '/playground'

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

export const redisClient = redis.createClient({
  url: process.env.REDIS_URI
}) as any

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    })

    console.log('MongoDB Connected')
  } catch (error) {
    return console.error(error)
  }

  const options: Options = {
    formatError,
    endpoint: gqlEndpoint,
    playground: playgroundEndpoint,
    getEndpoint: true
  }

  const middlewares = [permissions]

  const server = new GraphQLServer({
    schema,
    context: createContext,
    middlewares
  })

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
