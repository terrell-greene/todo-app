import gql from 'graphql-tag'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { NexusGenRootTypes } from '../../generated'

const userQuery = gql`
  query getUser {
    user {
      id
      name
      email
      tasks {
        id
        rank
        description
        completed
      }
    }
  }
`

export default async (client: ApolloClient<InMemoryCache>) => {
  try {
    const { data } = await client.query({ query: userQuery })

    const user = data.user as NexusGenRootTypes['User']
    return { user }
  } catch (error) {
    return { user: null }
  }
}
