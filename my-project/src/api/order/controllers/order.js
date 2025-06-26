'use strict';

/**
 * A set of functions called "actions" for `order`
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order');
