


"use strict";

/**
 *  order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const jwt_decode = require("jwt-decode");
const dayjs = require('dayjs');

module.exports = createCoreController(
  "api::order.order",
  ({ strapi }) => ({

    async getCount(ctx) {
      const count = await strapi.db.query("api::order.order").count();

      ctx.send({count});
    },


    async GetOrdersByUser(ctx) {
      let decoded = jwt_decode(ctx.request.header.authorization); 
      const userId = decoded.id;
  
      let orders = await strapi.entityService.findMany('api::order.order',{
        filters : {
          user : userId
        },
        populate : {
           formation : {
              fields : ["title","slug","price"],

              populate : {
                formations_category : {
                  fields : ["title","slug","icon","buttonIcon"]
                },
                image : {
                  fields : ["url"]
                }
              }
           }
        },
        fields : ["with","totalPrice","payement","createdAt","publishedAt","updatedAt"],
        sort: { id: 'DESC' },
            });
  
            ctx.send(orders);

    },

    async CreateOrder(ctx) {
      let decoded = jwt_decode(ctx.request.header.authorization);
      const userId = decoded.id;
      dayjs.locale('fr')
      const date_tz =  dayjs().format()
      let data = {...ctx.request.body.data};         
      data.user = userId
      data.publishedAt = date_tz
      const post =  await strapi.entityService.create("api::order.order",{data : {...data}})
     ctx.send(post);
    },
  })
);



