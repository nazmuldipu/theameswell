const fetchSeoData = require('../../scripts/utils/fetch-seo-data.cjs')

/**
 * fetch data of dine page
 * 
 * @returns {object} pageDatas
 */
async function getAllData() {
    let rawData = []
    let manipulateData = {}

    try {
        await fetchSeoData().then((response)=>{
            rawData = response.data.websiteMetaBySlug  
        }).catch((errors)=>{
            throw new Error(errors);
        })
    } catch (error) {
        throw new Error(error);
    }

    if (rawData?.length) {
        rawData.forEach((data)=>{
            if(data.page.path === '/'){
                manipulateData['index'] = data.attributes    
            } else {
                manipulateData[data.page.path.substring(1)] = data.attributes
            }
        })
    }else{
        manipulateData = {}
    }

    return  manipulateData

}
module.exports  = getAllData