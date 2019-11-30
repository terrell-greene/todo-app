import { request, GraphQLClient } from 'graphql-request'
import { url, TestError, getToken } from './utils'

const usersQuery = `
  query UsersQuery {
    users {
      id
    }
  }
`

describe('users', () => {
  let client: GraphQLClient

  beforeAll(async () => {
    const token = await getToken()

    client = new GraphQLClient(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  })

  it('should throw an error if not authenticated ', async () => {
    try {
      await request(url, usersQuery)
    } catch (error) {
      const {
        response: { errors }
      } = error as TestError

      const { name } = errors[0]

      expect(name).toEqual('AuthorizationError')
    }
  })

  it('should return a list of users', async () => {
    const { users } = await client.request(usersQuery)

    expect(Array.isArray(users)).toBeTruthy()
    expect(users[0]).toHaveProperty('id')
  })
})
