export default class CommodityHelper{
    /**
     * Get all css - (shadow dom purpose).
     * 
     * @returns {string}
     */
    static getAllCss() {
        const allCSS = [...document.styleSheets]
            .map(styleSheet => {
                try {
                    return [...styleSheet.cssRules]
                        .map(rule => rule.cssText)
                        .join('');
                } catch (e) {
                    console.log('Access to stylesheet %s is denied. Ignoring...', styleSheet.href);
                }
            })
            .filter(Boolean)
            .join('\n');
        return allCSS
    }

    /**
     * cms api's base uri.
     * 
     * @returns {string}
     */
    static getBaseUri() {
        let apiType = document.querySelector('meta[name="api_type"]').content
        if (apiType === 'PROD') {
            return 'https://cms-api.skipperhospitality.com/_graphql'
        } else if (apiType === 'STAGE') {
            return 'https://cms-api-stage.skipperhospitality.com/_graphql'
        } else {
            return 'https://cms-api-dev.skipperhospitality.com/_graphql'
        }
    }
}