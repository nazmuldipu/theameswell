/**
 * Fetch api function
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch}
 * 
 * @param {string} url
 * @param {object} options
 * @returns 
 */
 async function fetchApi(url,options={headers:''}) {

    let theOptions = {
        method: 'GET',
    }

    if (options.headers !== '') {
        theOptions.headers = options.headers
    }

    const response =  await fetch(url,theOptions)

    return response
}

export {
    fetchApi
}