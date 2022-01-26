'use strict';
import '../../components/WeatherWidget/index.js';

import { createWidget } from '@typeform/embed'
import '@typeform/embed/build/css/widget.css'

const { refresh } = createWidget(WEDDING_RFP_TYPEFORM_ID, { 
   container: document.querySelector('#wedding-rfp-form'),
   shareGaInstance: true,
   hideFooter: false,
   hideHeaders: true,
   opacity: 0,
   lazy: true,
   height: 500
});