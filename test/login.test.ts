import { request } from 'graphql-request'
import { url, TestError, loginMutation } from './utils'

describe('login', () => {
  const args = {
    email: 'johndoe@gmail.com',
    password: '00000000'
  }

  it('should throw an error for not providing email', async () => {
    try {
      await request(url, loginMutation, { ...args, email: ' ' })
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
      await request(url, loginMutation, { ...args, email: 'test' })
    } catch (error) {
      const {
        response: { errors }
      } = error as TestError

      const { name } = errors[0]

      expect(name).toEqual('Invalid Email')
    }
  })

  it('should throw an error is no user found', async () => {
    try {
      await request(url, loginMutation, { ...args, password: '000' })
    } catch (error) {
      const {
        response: { errors }
      } = error as TestError

      const { name, data } = errors[0]

      expect(name).toEqual('LoginError')
      expect(data).toHaveProperty('password')
    }
  })

  it("should throw an error if password isn't correct", async () => {
    try {
      await request(url, loginMutation, { ...args, password: '000' })
    } catch (error) {
      const {
        response: { errors }
      } = error as TestError

      const { name, data } = errors[0]

      expect(name).toEqual('LoginError')
      expect(data).toHaveProperty('password')
    }
  })

  it('should return a token and user', async () => {
    const {
      login: { token, user }
    } = await request(url, loginMutation, {
      email: 'johndoe@gmail.com',
      password: '00000000'
    })

    expect(typeof token).toBe('string')
    expect(user).toHaveProperty('id')
  })
})
