import { ContextParameters } from 'graphql-yoga/dist/types'
import { Request } from 'express-serve-static-core'

export interface Context {
  request: Request
}

export function createContext(request: ContextParameters) {
  return {
    ...request
  }
}
