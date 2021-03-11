'use strict';

import { sendContact } from '../lib/helpers.js'

export default class FormSender extends HTMLElement {
    constructor() {
        super();
        this.submitButton = this.getElementsByClassName('submit__button')?.[0];
        this.form = this.getElementsByTagName('form')?.[0];
        this.submitButton.onclick = () => {
            sendContact(this.form, this.dataset.type)
                .then(res => {
                    if(res.ok) {
                        console.log('contact response', res.json())
                    } else {
                        throw new Error(`SERVER ERROR ${res.status} -- ${res.statusText}`);
                    }
                })
                .catch(err => console.error('contact response error', err));
        }
    }
}

customElements.define('form-sender', FormSender);