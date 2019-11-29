import { NextPage } from 'next'
import cookie from 'cookie'
import gql from 'graphql-tag'
import { useState } from 'react'
import { useMutation, useApolloClient } from '@apollo/react-hooks'

import redirect from '../lib/redirect'

const SignUpMutation = gql`
  mutation SignUpMutation(
    $name: String!
    $email: Email!
    $password: Password!
    $confirmPassword: Password!
  ) {
    signup(
      data: {
        name: $name
        email: $email
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
        data: { password, email }
      } = error.graphQLErrors[0] as any

      setPasswordError(password)
      setEmailError(email)
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

  const [nameValue, setNameValue] = useState('')
  const [nameError, setNameError] = useState(null)

  const [emailValue, setEmailValue] = useState('')
  const [emailError, setEmailError] = useState(null)

  const [passwordValue, setPasswordValue] = useState('')
  const [passwordError, setPasswordError] = useState(null)

  const [confirmPasswordValue, setConfirmPasswordValue] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState(null)

  const onFormSubmit = e => {
    e.preventDefault()
    let valid = true

    if (nameValue.trim() === '') {
      setNameError('Name is required')
      valid = false
    } else {
      setNameError(null)
    }

    if (emailValue.trim() === '') {
      setEmailError('Email is required')
      valid = false
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailValue)
    ) {
      setEmailError('Please enter a valid email')
      valid = false
    } else {
      setEmailError(null)
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
          name: nameValue,
          email: emailValue,
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
          placeholder="Name"
          value={nameValue}
          onChange={e => setNameValue(e.target.value)}
        />
        <div className="error">{nameError}</div>
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Email"
          value={emailValue}
          onChange={e => setEmailValue(e.target.value)}
        />
        <div className="error">{emailError}</div>
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
