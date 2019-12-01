import { createError } from 'apollo-errors'

export const ServerError = createError('ServerError', {
  message: 'Server error encountered'
})

export const AuthorizationError = createError('AuthorizationError', {
  message: 'Not authorized!'
})

export const EmailScalarError = createError('Invalid Email', {
  message: 'Expected type Email!'
})

export const PasswordScalarError = createError('Invalid Password', {
  message: 'Expected type Password!'
})

export const SignUpError = createError('SignUpError', {
  message: 'Signup error encountered'
})

export const LoginError = createError('LoginError', {
  message: 'Login error encountered'
})

export const LogoutError = createError('LogoutError', {
  message: 'Logout error encountered'
})

export const CreateCategoryError = createError('CreateCategoryError', {
  message: 'Create category error encountered'
})
