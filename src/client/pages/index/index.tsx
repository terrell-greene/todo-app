import { NextPage } from 'next'
import Login from '../../components/login'
import './home.scss'
import checkLoggedIn from '../../lib/checkLoggedIn'
import { withApollo } from '../../lib/apollo'
import redirect from '../../lib/redirect'

const IndexPage: NextPage = () => {
  return (
    <div className="container">
      <h1 className="header">Welcome back!</h1>
      <div className="auth">
        <Login />
      </div>
      <p className="link">
        Don't have an account? <a>Get Started!</a>
      </p>
    </div>
  )
}

IndexPage.getInitialProps = async (context: any) => {
  const { user } = await checkLoggedIn(context.apolloClient)

  if (user) {
    redirect(context, '/dashboard')
  }

  return { user }
}

export default withApollo(IndexPage)
