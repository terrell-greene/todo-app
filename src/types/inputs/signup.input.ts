import { inputObjectType } from 'nexus'

export const SignUpInput = inputObjectType({
  name: 'SignUpInput',
  description: 'Input type for signing up a user',
  definition(t) {
    t.string('username', { required: true })
    t.password('password', { required: true })
    t.password('confirmPassword', { required: true })
  }
})
