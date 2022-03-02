import CommodityHelper from './commodity-helper'

/**
 * Fetch api function (core feature)
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch}
 * @see {@link https://www.netlify.com/blog/2020/12/21/send-graphql-queries-with-the-fetch-api-without-using-apollo-urql-or-other-graphql-clients/}
 * 
 * @param {string} commodityId
 * @param {string} pageUid page uid is optional.
 * @returns {json}
 */
 async function getCommodity(commodityId='',pageUid='', itemId='') {

    let url = CommodityHelper.getBaseUri()
    let variables = {"allCommodityId": commodityId}

    if (pageUid !== '') {
      variables['pagesId'] = pageUid
    }

    if (itemId !== '') {
      variables['commodityitemSetId'] = itemId
    }

    let options = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'X-API-SECRET-KEY': '9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b'
        },
        body: JSON.stringify({
            query: `
            query AllCommodity($allCommodityId: UUID, $pagesId: UUID, $commodityitemSetId: UUID) {
                allCommodity(id: $allCommodityId) {
                  edges {
                    node {
                      title
                      slug
                      name
                      queries
                      commodityitemSet(pages_Id: $pagesId, id: $commodityitemSetId) {
                        edges {
                          node {
                            values
                            id
                            isOnline
                            isFeature
                            isRecurrence
                            recurrenceDate
                          }
                        }
                      }
                    }
                  }
                }
            }             
            `,
            variables: variables
        })
    }
    const response =  await fetch(url,options).then((res) => res.json())
    return response
}

export {
    getCommodity
}