import gql from 'graphql-tag'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'

import { withApollo } from '../lib/apollo'

const query = gql`
  query {
    hello
  }
`

const clientQuery = gql`
  query {
    clientTest @client
  }
`

const getCache = gql`
  query {
    getCache @client
  }
`

const IndexPage = () => {
  const api = useQuery(query)
  const client = useQuery(clientQuery)
  const cache = useQuery(getCache)

  return (
    <div>
      Hello, World!, <br />
      {api.data && api.data.hello} <br />
      {client.data && client.data.clientTest} <br />
      {cache.data && JSON.stringify(cache.data.getCache)}
    </div>
  )
}

export default withApollo(IndexPage)
