"use strict";

/**
 *  formation controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { parseMultipartData, sanitizeEntity } = require("@strapi/utils");

// module.exports = createCoreController('api::formation.formation');

module.exports = createCoreController(
  "api::faq.faq",
  ({ strapi }) => ({

    async faqHome(ctx) {
      const faq = await strapi.db.query("api::faq.faq").findMany({
        populate: [
          "faq",
        ],
       
      });
     faq[0].faq =  faq[0].faq.slice(0, 4);
      ctx.send(faq);
    },


  })

);
