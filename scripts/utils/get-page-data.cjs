const fetchPageData = require('../../scripts/utils/fetch-page-data.cjs')

/**
 * fetch data of dine page
 * 
 * @returns {object} pageDatas
 */
async function getAllData(page='') {
    let rawData = []
    let manipulateData = {}
    
    let argument = {
        brand: process.env.BRAND_SLUG,
        page: page
    }

    try {
        await fetchPageData(argument.brand,argument.page).then((response)=>{
            rawData = response.data.contentBySlug   
        }).catch((errors)=>{
            throw new Error(errors);
        })
    } catch (error) {
        throw new Error(error);
    }

    if (rawData?.length){
        rawData.forEach((data)=>{
            manipulateData[data.name] = data.values
        })
    }else{
        manipulateData = rawData
    }

    return {
        pageCMS: manipulateData
    }
}
module.exports  = getAllData