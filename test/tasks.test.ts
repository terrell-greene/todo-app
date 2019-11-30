import { request, GraphQLClient } from 'graphql-request'
import { url, TestError, getToken } from './utils'

const tasksQuery = `
  query TasksQuery {
    tasks {
      id
    }
  }
`

describe('tasks', () => {
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
      await request(url, tasksQuery)
    } catch (error) {
      const {
        response: { errors }
      } = error as TestError

      const { name } = errors[0]

      expect(name).toEqual('AuthorizationError')
    }
  })

  it('should return a list of tasks', async () => {
    const { tasks } = await client.request(tasksQuery)

    expect(Array.isArray(tasks)).toBeTruthy()
  })
})
