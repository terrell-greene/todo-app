import { arg, extendType } from 'nexus'
import validator from 'validator'
import { hash, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import { SignUpError, ServerError } from '../../../errors'
import { Token, APP_SECRET } from '../../../utils'
import { createSession } from './auth.utils'

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
        const { name, email, password, confirmPassword } = data

        if (!equals(password, confirmPassword)) {
          throw new SignUpError({
            data: {
              password: 'Password fields do not match'
            }
          })
        }

        try {
          const emailExist = await db.User.findOne({ email })

          if (emailExist) {
            throw new SignUpError({
              data: {
                email: 'Email is already in use'
              }
            })
          }

          const hashedPassword = await hash(password, 10)

          const userData = { ...data, password: hashedPassword }

          const newUser = await db.User.create(userData)

          const token = await createSession({ email, userId: newUser.id })

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

    // t.field('login', {
    //   type: 'AuthPayload',
    //   resolve: async (_, args, ctx) => {}
    // })
  }
})
