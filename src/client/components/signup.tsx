import { NextPage } from 'next'
import cookie from 'cookie'
import gql from 'graphql-tag'
import { useState } from 'react'
import { useMutation, useApolloClient } from '@apollo/react-hooks'

import redirect from '../lib/redirect'

const SignUpMutation = gql`
  mutation SignUpMutation(
    $username: String!
    $password: Password!
    $confirmPassword: Password!
  ) {
    signup(
      data: {
        username: $username
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      token
    }
  }
`

const Signup: NextPage = () => {
  const client = useApolloClient()

  const [signup] = useMutation(SignUpMutation, {
    onError: error => {
      const {
        data: { password, username }
      } = error.graphQLErrors[0] as any

      setPasswordError(password)
      setUsernameError(username)
    },
    onCompleted: data => {
      document.cookie = cookie.serialize('token', data.signup.token, {
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

  const [confirmPasswordValue, setConfirmPasswordValue] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState(null)

  const onFormSubmit = e => {
    e.preventDefault()
    let valid = true

    if (usernameValue.trim() === '') {
      setUsernameError('Username is required')
      valid = false
    } else {
      setUsernameError(null)
    }

    if (passwordValue.trim() === '') {
      setPasswordError('Password is required')
      valid = false
    } else if (passwordValue.length < 8 || passwordValue.length > 20) {
      setPasswordError('Password must be between 8 and 20 characters')
      valid = false
    } else {
      setPasswordError(null)
    }

    if (confirmPasswordValue.trim() === '') {
      setConfirmPasswordError('Confirm password is required')
      valid = false
    } else if (
      confirmPasswordValue.length < 8 ||
      confirmPasswordValue.length > 20
    ) {
      setConfirmPasswordError(
        'Confirm password must be between 8 and 20 characters'
      )
      valid = false
    } else if (confirmPasswordValue !== passwordValue) {
      setConfirmPasswordError('Passwords do not match')
      valid = false
    } else {
      setConfirmPasswordError(null)
    }

    if (valid) {
      signup({
        variables: {
          username: usernameValue,
          password: passwordValue,
          confirmPassword: confirmPasswordValue
        }
      })
    }
  }

  return (
    <form onSubmit={onFormSubmit}>
      <div className="input-container">
        <input
          type="text"
          placeholder="username"
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

      <div className="input-container">
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPasswordValue}
          onChange={e => setConfirmPasswordValue(e.target.value)}
        />
        <div className="error">{confirmPasswordError}</div>
      </div>

      <button type="submit"> SignUp </button>
    </form>
  )
}

export default Signup
