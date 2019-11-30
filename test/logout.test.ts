import { request, GraphQLClient } from 'graphql-request'
import { url, TestError, loginMutation, getToken } from './utils'

const logoutMutation = `
    mutation LogoutMutation {
        logout
    }
`

describe('login', () => {
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
      await request(url, logoutMutation)
    } catch (error) {
      const {
        response: { errors }
      } = error as TestError

      const { name } = errors[0]

      expect(name).toEqual('AuthorizationError')
    }
  })

  it('should return  "true"  for successfully loging out', async () => {
    const { logout } = await client.request(logoutMutation)

    expect(logout).toBeTruthy()
  })
})
