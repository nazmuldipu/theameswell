/**
 * Fetch api function
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch}
 * @see {@link https://www.netlify.com/blog/2020/12/21/send-graphql-queries-with-the-fetch-api-without-using-apollo-urql-or-other-graphql-clients/}
 * 
 * @param {string} commodityId
 * @returns {json}
 */
 async function getCommodity(commodityId="") {

    let url = 'https://api.spacex.land/graphql/'

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query ExampleQuery($launchId: ID!) {
                    roadster {
                        apoapsis_au
                    }
                    launch(id: $launchId) {
                        id
                        is_tentative
                        details
                    }
                }              
            `,
            variables:{
                "launchId": commodityId
            }
        })
    }

    const response =  await fetch(url,options).then((res) => res.json())
    return response

}

export {
    getCommodity
}