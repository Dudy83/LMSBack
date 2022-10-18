'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('colorpicker')
      .service('myService')
      .getWelcomeMessage();
  },
};
