"use strict";

/**
 *  formations-categorie controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const jwt_decode = require("jwt-decode");

module.exports = createCoreController(
  "api::formations-categorie.formations-categorie",
  ({ strapi }) => ({
    async getCount(ctx) {
      const count = await strapi.db
        .query("api::formations-categorie.formations-categorie")
        .count();

      ctx.send({ count });
    },

    async getCategAndCount(ctx) {
      let decoded = (ctx.request.header && ctx.request.header.authorization) ? jwt_decode(ctx.request.header.authorization) : null;
      const userId = (decoded) ? decoded.id : null;
      let categs;
      if(userId){
     categs = await strapi.entityService.findMany('api::formations-categorie.formations-categorie', {

          populate : {
            formations : {
              fields :  ["id"],

            }
          },
          sort : { id : 'DESC'}
        });  }else{
          categs = await strapi.entityService.findMany('api::formations-categorie.formations-categorie', {
            filters : {
              showCategory : true
            },
            populate : {
              formations : {
                fields :  ["id"],
                filters : { 
                  showFormation : {
                    $eq : true
                  }
                }
  
              }
            },
            sort : { id : 'DESC'}
          });

        }

      categs.forEach((el) => {
        let count = el.formations.length;
        delete el.formations;
        el["formation_count"] = count;
      });


      ctx.send(categs);
    },

    async getCategs(ctx){
      let decoded = (ctx.request.header && ctx.request.header.authorization) ? jwt_decode(ctx.request.header.authorization) : null;
      const userId = (decoded) ? decoded.id : null;
      let categs;
      if(userId){
      categs = await strapi.entityService.findMany('api::formations-categorie.formations-categorie', {

        populate : {
          formations : {
            fields :  ["slug","title"],
                     },
          image : {
            fields : ["url"]
          }
        },
        sort : { id : 'DESC'}
      });

      }else{
        categs = await strapi.entityService.findMany('api::formations-categorie.formations-categorie', {
          filters : {
            showCategory : true
          },
          populate : {
            formations : {
              fields :  ["slug","title"],
              filters : { 
                showFormation : {
                  $eq : true
                }
              }
  
            },
            image : {
              fields : ["url"]
            }
          },
          sort : { id : 'DESC'}
        });
      }

    ctx.send(categs);
    }
  })
);
