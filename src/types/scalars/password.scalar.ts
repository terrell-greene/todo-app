import { scalarType } from 'nexus'
import validator from 'validator'
import { PasswordScalarError } from '../../errors'

const { isLength, escape } = validator

export const PasswordScalar = scalarType({
  name: 'Password',
  asNexusMethod: 'password',
  parseValue(value) {
    const password = escape(value)

    if (
      !isLength(password, {
        min: 8,
        max: 20
      })
    ) {
      throw new PasswordScalarError({
        message: `"${value}", is not a valid password`,
        data: {
          password: 'Password must be between 8 and 20 characters'
        }
      })
    }

    return value
  },
  serialize: value => value
})
