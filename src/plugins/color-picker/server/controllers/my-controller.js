'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('color-picker')
      .service('myService')
      .getWelcomeMessage();
  },
};
