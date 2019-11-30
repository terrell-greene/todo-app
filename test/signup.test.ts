import { request } from 'graphql-request'
import * as mongoose from 'mongoose'
import { url, TestError } from './utils'
import { User } from '../src/db'

const signupMutation = `
   mutation SignUpMutation(
       $name: String!, 
       $email: Email!,
       $password: Password!, 
       $confirmPassword: Password!
    ) {
        signup(
            data: { 
                name: $name, 
                email: $email, 
                password: $password, 
                confirmPassword: $confirmPassword 
            }
        ) {
            token
            user {
                id
            }
        }
    }
`

describe('signup', () => {
  const args = {
    name: 'Test',
    email: 't@test.com',
    password: '00000000',
    confirmPassword: '00000000'
  }

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
  })

  afterEach(async () => {
    await User.findOneAndDelete({ email: args.email })
  })

  afterAll(async () => {
    mongoose.disconnect()
  })

  it('should throw an error for not providing email', async () => {
    try {
      await request(url, signupMutation, { ...args, email: ' ' })
    } catch (error) {
      const {
        response: { errors }
      } = error as TestError

      const { name } = errors[0]

      expect(name).toEqual('Invalid Email')
    }
  })

  it('should throw an error for providing an invalid email', async () => {
    try {
      await request(url, signupMutation, { ...args, email: 'test' })
    } catch (error) {
      const {
        response: { errors }
      } = error as TestError

      const { name } = errors[0]

      expect(name).toEqual('Invalid Email')
    }
  })

  it('should throw and error if no password provided', async () => {
    try {
      await request(url, signupMutation, { ...args, password: ' ' })
    } catch (error) {
      const {
        response: { errors }
      } = error as TestError

      const { name } = errors[0]

      expect(name).toEqual('Invalid Password')
    }
  })

  it('should throw an error for password being under 8 characters', async () => {
    try {
      await request(url, signupMutation, { ...args, password: '000' })
    } catch (error) {
      const {
        response: { errors }
      } = error as TestError

      const { name } = errors[0]

      expect(name).toEqual('Invalid Password')
    }
  })

  it('should throw an error for password being over 20 characters', async () => {
    try {
      await request(url, signupMutation, {
        ...args,
        password: '00000000000000000000000'
      })
    } catch (error) {
      const {
        response: { errors }
      } = error as TestError

      const { name } = errors[0]

      expect(name).toEqual('Invalid Password')
    }
  })

  it('should throw an error if passwords do not match', async () => {
    try {
      await request(url, signupMutation, {
        ...args,
        password: '00000000',
        confirmPassword: '11111111'
      })
    } catch (error) {
      const {
        response: { errors }
      } = error as TestError

      const { name, data } = errors[0]

      expect(name).toEqual('SignUpError')
      expect(data).toHaveProperty('password')
    }
  })
})
