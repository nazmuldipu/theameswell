'use strict';

import { sendContact, isValid } from '../lib/helpers.js';
import {
    STATUS_COLOR_ERROR,
    STATUS_COLOR_NORMAL,
    STATUS_COLOR_SUCCESS,
    SUCCESS_MESSAGE,
    ERROR_MESSAGE,
    LOADING_MESSAGE,
    INVALID_MESSAGE
} from '../lib/constants.js';

export default class FormSender extends HTMLElement {

    static formInteractionEvents = ['click', 'keydown'];

    constructor() {
        super();
        this.submitButton = this.getElementsByClassName('submit__button')?.[0];
        this.ajaxStatusEl = this.getElementsByClassName('ajax__status')?.[0];
        this.setStatusColor(STATUS_COLOR_NORMAL);
        this.form = this.getElementsByTagName('form')?.[0];

        this.formInteractionHandler = (e) => {
            console.log('form interaction hanlding', e)
            this.clearFormInteractionListeners();
            this.hideStatus();
        };

        this.form.onsubmit = (e) => {
            // validate form here -- idealy we combine the iteration of form fields
            // and the iteration of sendContact -- we will refactor later
            e.preventDefault();
            if(isValid(this.form)) {
                this.showStatus();
                this.setStatusCopy(LOADING_MESSAGE);
                this.setStatusColor(STATUS_COLOR_NORMAL);
                sendContact(this.form, this.dataset.type)
                .then(res => {
                    if(res.ok) {
                        // then success
                        res.json().then(body => {
                            this.setStatusCopy(SUCCESS_MESSAGE);
                            this.setStatusColor(STATUS_COLOR_SUCCESS);
                            this.clearForm();
                        })
                    } else {
                        console.log('res err', res)

                        if (res.body instanceof ReadableStream) {
                            // then we have an error object
                            res.json().then(e => {
                                throw e;
                            });
                        }
                        throw new Error(`SERVER ERROR ${res.status} -- ${res.statusText}`);
                    }
                })
                .catch(err => {
                    this.setStatusCopy(ERROR_MESSAGE);
                    this.setStatusColor(STATUS_COLOR_ERROR);
                    console.error('contact response error', err)
                })
                .finally(() => {
                    this.applyFormInteractionListeners();
                });
            } else  {
                this.setStatusCopy(INVALID_MESSAGE);
                this.setStatusColor(STATUS_COLOR_ERROR);
                this.applyFormInteractionListeners();
            }
        };
    }

    applyFormInteractionListeners() {
        FormSender.formInteractionEvents.forEach(event => {
            this.form.addEventListener(event, this.formInteractionHandler, { once: true });
        });
    }

    clearFormInteractionListeners() {
        FormSender.formInteractionEvents.forEach(event => {
            this.form.removeEventListener(event, this.formInteractionHandler, { once: true })
        });
    }

    clearForm() {
        this.form.reset();
    }

    setStatusCopy(copy) {
        this.ajaxStatusEl.textContent = copy;
    }

    hideStatus() {
        this.ajaxStatusEl.classList.add('hidden');
    }

    showStatus() {
        this.ajaxStatusEl.classList.remove('hidden');
    }

    setStatusColor(color) {
        this.ajaxStatusEl.classList.remove(STATUS_COLOR_NORMAL, STATUS_COLOR_SUCCESS, STATUS_COLOR_ERROR);
        this.ajaxStatusEl.classList.add(color);
    }
}

customElements.define('form-sender', FormSender);