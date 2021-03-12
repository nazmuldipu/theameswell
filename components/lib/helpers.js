'use strict';

import {
    CONTACT_URL
} from './constants.js';

const shouldRecordFormEl = el => {
    if(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
        if(el.type === 'checkbox' || el.type === 'radio') {
            return el.checked;
        }
        // check for empty text
        return el.value !== "";
    }
    
    return false;
}

export const isValid = (form) => {
    return Array.from(form.elements).every( el => (el.required && el.value) || !el.required );
}

export const getBodyFromForm = form => {
    const elements = form.elements;
    return Array.from(elements).reduce((body, el) => {
        if (shouldRecordFormEl(el)) {
            if(body[el.name]) {
                //we assume that for multiply encountered names, we want to send all registered values
                if(Array.isArray(body[el.name])) {
                    body[el.name].push(el.value);
                } else {
                    body[el.name] = [ body[el.name], el.value ];
                }
            } else {
                body[el.name] = el.value;
            }
        }
        return body;
    }, {});
};

export async function sendContact(form, contactType) {
    const requestBody = getBodyFromForm(form);

    const response = await fetch(`${CONTACT_URL}${contactType}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    return response;
}