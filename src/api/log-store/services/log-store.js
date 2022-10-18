'use strict';

/**
 * log-store service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::log-store.log-store');
