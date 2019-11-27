import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

import { withApollo } from '../lib/apollo'

const query = gql`
  query {
    hello
  }
`

const IndexPage = () => {
  const { data } = useQuery(query)

  return (
    <div>
      Hello, World!, <br />
      {JSON.stringify(data)}
    </div>
  )
}

export default withApollo(IndexPage)
