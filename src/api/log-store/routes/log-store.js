'use strict';

/**
 * log-store router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::log-store.log-store');
