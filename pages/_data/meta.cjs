'use strict';
const {platform} = require('os')
module.exports = {
    env: process.env.THE_ENV || 'local',
    api_type: process.env.ACTIVE_API_URI,
    platform: platform(),
    globalJSTypes: ['module'] // 'module', 'sync','async','defer',
};