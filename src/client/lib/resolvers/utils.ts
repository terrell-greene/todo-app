import ApolloClient from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { ApolloCache } from 'apollo-cache'

export interface Context {
  client: ApolloClient<NormalizedCacheObject>
  cache: ApolloCache<NormalizedCacheObject>
  getCacheKey: any
}
