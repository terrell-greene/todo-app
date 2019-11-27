import { ContextParameters } from 'graphql-yoga/dist/types'
import { Request } from 'express-serve-static-core'
import * as db from './db'

export interface Context {
  db: db.IDB
  request: Request
}

export function createContext(request: ContextParameters) {
  return {
    ...request,
    db
  }
}
