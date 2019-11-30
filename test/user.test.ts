import { request, GraphQLClient } from 'graphql-request'
import { url, TestError, getToken } from './utils'

const userQuery = `
    query UserQuery {
        user {
            id
        }
    }
`

describe('user', () => {
  let client: GraphQLClient

  beforeAll(async () => {
    const token = await getToken()

    client = new GraphQLClient(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  })

  it('should throw an error if not authenticated', async () => {
    try {
      await request(url, userQuery)
    } catch (error) {
      const {
        response: { errors }
      } = error as TestError

      const { name } = errors[0]

      expect(name).toEqual('AuthorizationError')
    }
  })

  it('should return a user object', async () => {
    const { user } = await client.request(userQuery)

    expect(user).toHaveProperty('id')
  })
})
