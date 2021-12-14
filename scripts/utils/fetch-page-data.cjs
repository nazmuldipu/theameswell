const  Client = require('./apollo.cjs')
const { gql } = require('@apollo/client/core')

/**
 * Fetch page data
 * 
 * @param {string} brandSlug 
 * @param {string} pagePath
 * @return {promise} promise
 */
async function fetchPageData(brandSlug, pagePath, query = ''){
    
    let PAGE_QUERY = gql`
    query ContentBySlug($pagePath: String!, $brandSlug: String!, $isDirty: Boolean) {
      contentBySlug(pagePath: $pagePath, brandSlug: $brandSlug, isDirty: $isDirty) {
        ...on ContentType {
          name
          values
          title
          order
        }
        ... on PublishedContentType {
          name
          values
          title
          order
        }
      }
    }
    `
    let variables = {
      "pagePath": pagePath,
      "brandSlug": brandSlug,
    }
    if (process.env.THE_PREVIEW){
      variables['isDirty'] = true
    }
    const result = await Client.query({
      query: PAGE_QUERY,
      variables: variables
    })
    return result
}

module.exports = fetchPageData

