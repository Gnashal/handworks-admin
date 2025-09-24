// src/apolloClient.js (or similar)
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { CombinedGraphQLErrors, CombinedProtocolErrors } from '@apollo/client/errors'
import { ErrorLink } from '@apollo/client/link/error'

const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Operation: ${operation}, Location: ${locations}, Path: ${path}`
      )
    )
  } else if (CombinedProtocolErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) =>
      console.log(
        `[Protocol error]: Message: ${message}, Operation: ${operation} Extensions: ${JSON.stringify(extensions)}`
      )
    )
  } else {
    console.error(`[Network error]: ${error}`)
  }
})

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_GATEWAY
})

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache()
})

export default client
