import { NextPage } from 'next'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const cacheQuery = gql`
  query {
    token @client
    user @client
  }
`

const DashboardPage: NextPage = () => {
  const { data } = useQuery(cacheQuery)

  console.log(data)
  return <h1>DASHBOARD</h1>
}

export default DashboardPage
