const merge = require('lodash/merge')

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV !== 'production',
    basename: process.env.PUBLIC_URL,
    isBrowser: typeof window !== 'undefined',
    corsproxy: process.env.REACT_APP_CORSPROXY || 'https://corsproxy-us-2pqbdk4vvq-uc.a.run.app/',
    cesiumToken: process.env.REACT_APP_ION_TOKEN ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMDJlZDM5My1mZWVmLTQ0NWItYjJlZS0xZDNlNzA1YTZjMzgiLCJpZCI6MTUzNTEsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1Njc2NTUzODl9.0Q5nX5mfkii90I3v40xgPvD31sReZPAxxTclqdkRUXU',
  },
  test: {},
  development: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:1337',
    assetUrl:
      process.env.REACT_APP_ASSET_URL || 'http://localhost:1337/upload/',
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:1337',
    assetUrl:
      process.env.REACT_APP_ASSET_URL || 'http://localhost:1337/upload/',
  },
}

module.exports = merge(config.all, config[config.all.env])
