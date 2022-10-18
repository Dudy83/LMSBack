'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('Notifications')
      .service('myService')
      .getWelcomeMessage();
  },
};
