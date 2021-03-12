'use strict';

import { sendContact, isValid } from '../lib/helpers.js'

export default class FormSender extends HTMLElement {
    constructor() {
        super();
        console.log('FORM SENDER CONSTRUCTOR')
        this.submitButton = this.getElementsByClassName('submit__button')?.[0];
        this.form = this.getElementsByTagName('form')?.[0];
        this.form.onsubmit = (e) => {
            // validate form here -- idealy we combine the iteration of form fields
            // and the iteration of sendContact -- we will refactor later
            e.preventDefault();
            if(isValid(this.form)) {
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
            } else  {
                console.log('form invalid');
            }
        };
    }
}

customElements.define('form-sender', FormSender);