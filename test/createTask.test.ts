import { GraphQLClient, request } from 'graphql-request'
import { getToken, TestError, url } from './utils'

const createTaskMutation = `
    mutation CreateTask($description: String!) {
        createTask(data: {description: $description}) {
            id
        }
    }
`

describe('createTask', () => {
  let client: GraphQLClient

  const args = {
    description: 'Test123'
  }

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
      await request(url, createTaskMutation, args)
    } catch (error) {
      const {
        response: { errors }
      } = error as TestError

      const { name } = errors[0]

      expect(name).toEqual('AuthorizationError')
    }
  })

  it('should return the created task', async () => {
    try {
      const { createTask } = await client.request(createTaskMutation, args)

      expect(createTask).toHaveProperty('id')
    } catch (error) {
      console.error(JSON.stringify(error))
    }
  })
})
