import { NextPage } from 'next'
import Router from 'next/router'
import cookie from 'cookie'
import gql from 'graphql-tag'
import { useState } from 'react'
import { useMutation, useApolloClient } from '@apollo/react-hooks'

import redirect from '../lib/redirect'

const LoginMutation = gql`
  mutation LoginMutation($email: Email!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      token
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
  }
`

const UpdateCache = gql`
  query {
    token
    user
  }
`

const Login: NextPage = () => {
  const client = useApolloClient()

  const [login] = useMutation(LoginMutation, {
    onError: error => {
      const {
        data: { password }
      } = error.graphQLErrors[0] as any

      setPasswordError(password)
    },
    onCompleted: data => {
      document.cookie = cookie.serialize('token', data.login.token, {
        sameSite: true,
        path: '/',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      })

      client.cache.reset().then(() => {
        redirect({}, '/dashboard')
      })
    }
  })

  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [passwordError, setPasswordError] = useState(null)

  const onFormSubmit = e => {
    e.preventDefault()

    login({ variables: { email: emailValue, password: passwordValue } })
  }

  return (
    <form onSubmit={onFormSubmit}>
      <div className="input-container">
        <input
          type="text"
          placeholder="Email"
          value={emailValue}
          onChange={e => setEmailValue(e.target.value)}
        />
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Password"
          value={passwordValue}
          onChange={e => setPasswordValue(e.target.value)}
        />
        <div className="error">{passwordError}</div>
      </div>

      <button type="submit"> Login </button>
    </form>
  )
}

export default Login
