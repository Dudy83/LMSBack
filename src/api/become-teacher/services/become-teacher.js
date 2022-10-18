'use strict';

/**
 * become-teacher service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::become-teacher.become-teacher');
