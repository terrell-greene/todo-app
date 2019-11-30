import { Server } from 'http'
import { request } from 'graphql-request'
import * as mongoose from 'mongoose'
import { GraphQLServer, Options } from 'graphql-yoga'
import { formatError } from 'apollo-errors'

import { schema } from '../src/schema'
import { createContext } from '../src/context'

export const url = 'http://localhost:4000/graphql'

export const loginMutation = `
   mutation LoginMutation($email: Email!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      token
      user {
          id
      }
    }
  }
`

export const getToken = async (): Promise<string> => {
  const {
    login: { token }
  } = await request(url, loginMutation, {
    email: 'johndoe@gmail.com',
    password: '00000000'
  })

  return token
}

export interface TestError {
  response: {
    errors: Array<{ name: string; data: any }>
  }
}

interface TestServer {
  server: Server
  port: number
  url: string
}

export const createTestServer = async (): Promise<TestServer> => {
  await mongoose.connect(process.env.MONGO_URI!, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })

  const port = Math.round(Math.random() * 100)

  const options: Options = {
    formatError,
    port
  }

  const graphqlServer = await new GraphQLServer({
    schema,
    context: createContext
  })

  const server = await graphqlServer.start(options)

  const url = `http://localhost:${port}`

  return { port, server, url }
}
