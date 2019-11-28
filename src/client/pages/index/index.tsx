import { NextPage } from 'next'
import Login from '../../components/login'
import './home.scss'

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

export default IndexPage
