const  Client = require('./apollo.cjs')
const { gql } = require('@apollo/client/core')

async function fetchSeoData(){
    
    let SEO_QUERY = gql`
    query Query($websiteMetaBySlugBrandSlug: String!) {
        websiteMetaBySlug(brandSlug: $websiteMetaBySlugBrandSlug) {
          attributes
          page {
            path
          }
        }
      }
    `
    const result = await Client.query({
      query: SEO_QUERY,
      variables: {
          "websiteMetaBySlugBrandSlug": process.env.BRAND_SLUG
      }
    })
    return result
}

module.exports = fetchSeoData

