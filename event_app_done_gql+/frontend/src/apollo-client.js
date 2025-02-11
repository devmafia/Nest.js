import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
  credentials: 'include',
})

const cache = new InMemoryCache(
  {
    addTypename: false
  }
)

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

apolloClient.resetStore()

export default apolloClient;

