'use strict'

import { getWeatherData } from '../lib/helpers.js';
import svgicon from './svgicon.js';

export default class WeatherWidget extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        // 1c == 33.8F
        getWeatherData("94043")
            .then(response => response.json())
            .then(data => {
                let temp = data.main.temp;
                // let Farentemp = data.main.temp * 53.8
                let wid = data.weather[0].id;
                let color = "white";
                let edge = "32px";
                
                //Make the icon size responsive
                if (screen.width < 900) {
                    edge = "24px";
                }

                let icon = svgicon(edge, color, wid);
                this.innerHTML = `
                    <div style="display:flex">
                        ${icon}
                        <p  class="text-base xmed:text-2xl pl-2 xmed:pl-3" >${temp} &#176</p>
                    </div> `;
            })
    }
}

customElements.define('weather-widget', WeatherWidget);