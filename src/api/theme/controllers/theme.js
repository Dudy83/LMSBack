"use strict";

/**
 *  theme controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::theme.theme", ({ strapi }) => ({
  async SetTheme(ctx) {
    let theme = await strapi.entityService.findMany("api::theme.theme", {
      populate: {
        logo: {
          fields: ["url"],
        },
        default_avatar: {
          fields: ["url"],
        },
        bannerFormation: {
          fields: ["url"],
        },
      },
      limit: 1,
    });

    ctx.send(theme);
  },

  async getColors(ctx) {
    let theme = await strapi.entityService.findOne("api::theme.theme", 1, {
      fields: ['mainColor', 'secondColor', 'lightColor', 'blackColor'],
    });

    ctx.send(theme);
  },
}));
