'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('Campagnes')
      .service('myService')
      .getWelcomeMessage();
  },
};
