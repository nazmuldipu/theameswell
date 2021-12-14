const { ApolloClient, createHttpLink, InMemoryCache } = require('@apollo/client/core')
const { setContext } = require('@apollo/client/link/context')
const fetch = require('cross-fetch')
require('dotenv').config()

const getBaseURI = () => {
  if (process.env.ACTIVE_API_URI === 'PROD') {
    return process.env[`GRAPHQL_BASE_URI_${process.env.ACTIVE_API_URI}`]
  }else if (process.env.ACTIVE_API_URI === 'STAGE') {
    return process.env[`GRAPHQL_BASE_URI_${process.env.ACTIVE_API_URI}`]
  }else{
    return process.env[`GRAPHQL_BASE_URI_${process.env.ACTIVE_API_URI}`]
  } 
}

const getSecretKey = () => {
  if (process.env.ACTIVE_API_URI === 'PROD') {
    return process.env[`GRAPHQL_SECRET_KEY_${process.env.ACTIVE_API_URI}`]
  }else if (process.env.ACTIVE_API_URI === 'STAGE') {
    return process.env[`GRAPHQL_SECRET_KEY_${process.env.ACTIVE_API_URI}`]
  }else{
    return process.env[`GRAPHQL_SECRET_KEY_${process.env.ACTIVE_API_URI}`]
  }
}

const BASE_URI = getBaseURI()

const httpLink = createHttpLink({
  uri: BASE_URI,
  fetch
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "X-API-SECRET-KEY": getSecretKey()
    }
  }
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const Client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions
});

module.exports = Client