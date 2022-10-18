'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('Chat')
      .service('myService')
      .getWelcomeMessage();
  },
};
