import { NextPage } from 'next'
import { useState, Fragment } from 'react'

import Login from '../../components/login'
import Signup from '../../components/signup'
import checkLoggedIn from '../../lib/checkLoggedIn'
import { withApollo } from '../../lib/apollo'
import redirect from '../../lib/redirect'

import './home.scss'

const IndexPage: NextPage = () => {
  const [loginView, setLoginView] = useState(true)

  const onViewChange = () => {
    setLoginView(!loginView)
  }
  return (
    <div className="container">
      <h1 className="header">{loginView ? 'Welcome back!' : 'Sign up now!'}</h1>
      <div className="auth">{loginView ? <Login /> : <Signup />}</div>
      <p className="link">
        {loginView ? (
          <Fragment>
            Don't have an account? <a onClick={onViewChange}>Get Started!</a>
          </Fragment>
        ) : (
          <Fragment>
            Already have an account? <a onClick={onViewChange}>Log back in!</a>
          </Fragment>
        )}
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
