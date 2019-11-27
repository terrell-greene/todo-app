import { inputObjectType } from 'nexus'

export const SignUpInput = inputObjectType({
  name: 'SignUpInput',
  description: 'Input type for signing up a user',
  definition(t) {
    t.email('email', { required: true })
    t.string('name', { required: true })
    t.password('password', { required: true })
    t.password('confirmPassword', { required: true })
  }
})
