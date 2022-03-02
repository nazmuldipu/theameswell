import CommodityHelper from '../../scripts/utils/commodity/commodity-helper'
import { getCommodity } from '../../scripts/utils/commodity/get-commodity'


class EventComponent extends HTMLElement{

    constructor(){
        super()
        this.shadow = this.attachShadow({mode: "open"})
    }

    /**
     * Connect web component.
     */
    connectedCallback(){
        this.render()
    }

    /**
     * Render DOM
     * 
     * @returns {void}
     */
    async render(){
        let commodity = await getCommodity('2d63c13c-66ff-4bdd-bac5-d8ed3871d267')
        // let queries = commodity.data.allCommodity.edges[0].node.queries
        let getData = commodity.data.allCommodity.edges[0].node.commodityitemSet.edges
        let events = []
        
        getData.forEach(item => {
            events.push(item.node.values.data)
        });
        
        // set html inside shadow dom
        this.shadow.innerHTML = `
        <style>${CommodityHelper.getAllCss()}</style>
        <div>
            <h1 class="font-bold uppercase" >Event Webcomponent</h1>
            <hr/>
            <div>${JSON.stringify(events)}</div> 
        </div>
        `
    }
}

customElements.define('event-component', EventComponent)