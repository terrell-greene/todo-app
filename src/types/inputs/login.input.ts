import { inputObjectType } from 'nexus'

export const LoginInput = inputObjectType({
  name: 'LoginInput',
  description: 'Input type for logging in a user',
  definition(t) {
    t.email('email', { required: true })
    t.string('password', { required: true })
  }
})
