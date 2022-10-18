'use strict';

module.exports = {
  findContentTypes(ctx) {
    ctx.body = strapi.plugin('tasks').service('tasks').getContentTypes();
},
};
