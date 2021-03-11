'use strict';

import { sendContact } from '../lib/helpers.js'

export default class FormSender extends HTMLElement {
    constructor() {
        super();
        console.log('FORM SENDER CONSTRUCTOR')
        this.submitButton = this.getElementsByClassName('submit__button')?.[0];
        this.form = this.getElementsByTagName('form')?.[0];
        this.submitButton.onclick = () => {
            sendContact(this.form, this.dataset.type)
                .then(res => {
                    if(res.ok) {
                        //change this to be promise logging
                        res.json().then(body => console.log('resp body', body))
                    } else {
                        console.log('res err', res)
                        if (res.body instanceof ReadableStream) {
                            // then we have an error object
                            res.json().then(e => console.log('error obj', e));
                        }
                        throw new Error(`SERVER ERROR ${res.status} -- ${res.statusText}`);
                    }
                })
                .catch(err => console.error('contact response error', err));
        }
    }
}

customElements.define('form-sender', FormSender);