import { rule, shield, and, or, not } from 'graphql-shield'

import { Context } from '../context'
import { redisClient } from '../server'
import { AuthorizationError } from '../errors'

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, { request }: Context, info) => {
    const { authorization } = request.headers

    if (!authorization) throw new AuthorizationError()

    const token = authorization!.replace('Bearer ', '')

    const userId = await redisClient.getAsync(token)

    if (!userId) throw new AuthorizationError()

    request.body = {
      ...request.body,
      token,
      userId
    }
    return true
  }
)

export default shield({
  Query: {
    users: not(isAuthenticated)
  },
  Mutation: {
    signup: not(isAuthenticated),
    login: not(isAuthenticated),
    logout: isAuthenticated,
    createTask: isAuthenticated
  }
})
