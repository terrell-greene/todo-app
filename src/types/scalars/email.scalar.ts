import { scalarType } from 'nexus'
import validator from 'validator'
import { EmailScalarError } from '../../errors'

const { isEmail, escape } = validator

export const EmailScalar = scalarType({
  name: 'Email',
  asNexusMethod: 'email',
  parseValue(value) {
    const email = escape(value)

    if (!isEmail(email)) {
      throw new EmailScalarError({
        message: `"${value}", is not a valid email address`
      })
    }

    return value
  },
  serialize: value => value
})
