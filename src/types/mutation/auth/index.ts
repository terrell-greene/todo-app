import { arg, extendType } from 'nexus'
import validator from 'validator'
import { hash, compare } from 'bcryptjs'

import {
  SignUpError,
  ServerError,
  LoginError,
  LogoutError
} from '../../../errors'
import { createSession, destroySession } from './auth.utils'

const { equals } = validator

export const Auth = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        data: arg({ type: 'SignUpInput', required: true })
      },
      resolve: async (_, { data }, { db }) => {
        const { username, password, confirmPassword } = data

        if (!equals(password, confirmPassword)) {
          throw new SignUpError({
            data: {
              password: 'Password fields do not match'
            }
          })
        }

        try {
          const usernameExists = await db.User.findOne({ username })

          if (usernameExists) {
            throw new SignUpError({
              data: {
                username: 'Username is already in use'
              }
            })
          }

          const hashedPassword = await hash(password, 10)

          const userData = { ...data, password: hashedPassword }

          const newUser = await db.User.create(userData)

          const token = await createSession({ username, userId: newUser.id })

          return {
            token,
            user: newUser
          }
        } catch (error) {
          if (error.data) throw error

          console.error(error)
          throw new ServerError()
        }
      }
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        data: arg({ type: 'LoginInput', required: true })
      },
      resolve: async (_, { data }, { db }) => {
        const { username, password } = data

        const throwLoginError = () => {
          throw new LoginError({
            data: {
              password: 'Invalid username/password combination'
            }
          })
        }

        try {
          const user = await db.User.findOne({ username }).populate({
            path: 'categories'
          })

          if (!user) throwLoginError()

          const valid = await compare(password, user!.password)

          if (!valid) throwLoginError()

          const token = await createSession({ username, userId: user!.id })

          return {
            token,
            user: user!
          }
        } catch (error) {
          if (error.data) throw error

          console.error(error)
          throw new ServerError()
        }
      }
    })

    t.field('logout', {
      type: 'Boolean',
      resolve: async (_, args, { request }) => {
        const {
          body: { token }
        } = request
        try {
          await destroySession(token)

          return true
        } catch (error) {
          throw new LogoutError()
        }
      }
    })
  }
})
