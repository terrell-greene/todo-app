import { NextPage } from 'next'
import { useApolloClient, useMutation } from '@apollo/react-hooks'
import cookie from 'cookie'

import { withApollo } from '../../lib/apollo'
import checkLoggedIn from '../../lib/checkLoggedIn'
import redirect from '../../lib/redirect'
import { NexusGenRootTypes } from '../../../generated'
import gql from 'graphql-tag'

interface DashboardPageProps {
  user: NexusGenRootTypes['User']
}

const logoutMutation = gql`
  mutation {
    logout
  }
`

const DashboardPage: NextPage<DashboardPageProps> = ({ user }) => {
  const client = useApolloClient()
  const [logoutUser] = useMutation(logoutMutation)

  const logout = async () => {
    try {
      const res = await logoutUser()

      if (res.data.logout) {
        document.cookie = cookie.serialize('token', '', {
          maxAge: -1 // Expire the cookie immediately
        })

        // Force a reload of all the current queries now that the user is
        // logged in, so we don't accidentally leave any state around.
        client.cache.reset().then(() => {
          // Redirect to a more useful page when signed out
          redirect({}, '/')
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={logout}>Sign Out</button>
    </div>
  )
}

DashboardPage.getInitialProps = async (context: any) => {
  const { user } = await checkLoggedIn(context.apolloClient)

  if (!user) {
    redirect(context, '/')
  }

  return { user }
}

export default withApollo(DashboardPage)
