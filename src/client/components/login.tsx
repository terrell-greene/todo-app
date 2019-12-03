import { NextPage } from 'next'
import Router from 'next/router'
import cookie from 'cookie'
import gql from 'graphql-tag'
import { useState } from 'react'
import { useMutation, useApolloClient } from '@apollo/react-hooks'

import redirect from '../lib/redirect'

const LoginMutation = gql`
  mutation LoginMutation($username: String!, $password: String!) {
    login(data: { username: $username, password: $password }) {
      token
    }
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

  const [usernameValue, setUsernameValue] = useState('')
  const [usernameError, setUsernameError] = useState(null)

  const [passwordValue, setPasswordValue] = useState('')
  const [passwordError, setPasswordError] = useState(null)

  const onFormSubmit = e => {
    e.preventDefault()
    let valid = true

    if (usernameValue.trim() === '') {
      setUsernameError('username is required')
      valid = false
    } else {
      setUsernameError(null)
    }

    if (passwordValue.trim() === '') {
      setPasswordError('Password is required')
      valid = false
    } else {
      setPasswordError(null)
    }

    if (valid) {
      login({ variables: { username: usernameValue, password: passwordValue } })
    }
  }

  return (
    <form onSubmit={onFormSubmit}>
      <div className="input-container">
        <input
          type="text"
          placeholder="Username"
          value={usernameValue}
          onChange={e => setUsernameValue(e.target.value)}
        />
        <div className="error">{usernameError}</div>
      </div>

      <div className="input-container">
        <input
          type="password"
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
