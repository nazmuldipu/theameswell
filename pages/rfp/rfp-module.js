'use strict';
import '../../components/WeatherWidget/index.js';

import { createWidget } from '@typeform/embed'
import '@typeform/embed/build/css/widget.css'

const { refresh } = createWidget(RFP_TYPEFORM_ID, { 
   container: document.querySelector('#rfp-form'),
   shareGaInstance: true,
   hideFooter: true,
   hideHeaders: true,
   opacity: 0,
   lazy: true,
   height: 500
});