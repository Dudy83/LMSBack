"use strict";

/**
 *  rating controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const jwt_decode = require("jwt-decode");
const dayjs = require('dayjs');

module.exports = createCoreController(
  "api::rating.rating",
  ({ strapi }) => ({

    async getCount(ctx) {
      const count = await strapi.db.query("api::rating.rating").count();
      ctx.send({ count });
    },

    async CommunityAvis(ctx) {
      let decoded = jwt_decode(ctx.request.header.authorization); 
      const userId = decoded.id;
      const slug = ctx.params.slug;
      const session_exist =   await strapi.entityService.findMany('api::session.session', { 
          filters : { 
              users_permissions_users: userId,
              formation : {
                slug : {
                    $eq : slug
                },
              }
          },
          populate : {
            formation : {
                  fields : ["id"]
              }
          },
          fields : ["id"],
          limit : 1
      });
      if(session_exist.length > 0  && session_exist[0].formation){
      const ratings = await strapi.entityService.findMany('api::rating.rating', {
        filters: {
          formation: session_exist[0].formation.id,
        },
        populate : {
          user : {
            fields :  ["username"],
            populate : {
              avatar : {
                fields : ["url"]
              }
            }
          }
        },
        sort : { id : 'DESC'}
      });

    const starCount = [0, 0, 0, 0, 0];
    let totalRate = 0;

    ratings.forEach((el) => {
      totalRate = totalRate + el.rate;

      const { rate } = el;
      if (rate > 0) starCount[rate - 1] = starCount[rate - 1] + 1;
    });

    const starSum = starCount.reduce((a, b) => a + b, 0);
    const result = ratings.length > 0 ? totalRate / ratings.length : 0;
    let result_final = parseInt(result.toFixed(0));
    let starAverage = [];

    if (starSum > 0) {
      for (let i of [0, 1, 2, 3, 4]) {
        const av = (starCount[i] / starSum) * 100;
        starAverage.push(av.toFixed(0));
      }
    } else starAverage = [0, 0, 0, 0, 0];
    const totalRatings = ratings.length;

    const obj = { starCount, starAverage , result_final ,totalRatings, ratings, formation : session_exist[0].formation.id }

    ctx.send(obj);
      }else{
        ctx.send(null);
      }
    },

    async forcoursedetail(ctx) {
      const id = ctx.params.id;

        let ratings = await strapi.entityService.findMany('api::rating.rating', {
          filters: {
            formation: id,
          },
          populate : {
            user : {
              fields :  ["username"],
              populate : {
                avatar : {
                  fields : ["url"]
                }
              }
            }
          },
          sort : { id : 'DESC'}
        });

      const starCount = [0, 0, 0, 0, 0];
      let totalRate = 0;

      ratings.forEach((el) => {
        totalRate = totalRate + el.rate;

        const { rate } = el;
        if (rate > 0) starCount[rate - 1] = starCount[rate - 1] + 1;
      });

      const starSum = starCount.reduce((a, b) => a + b, 0);
      const result = ratings.length > 0 ? totalRate / ratings.length : 0;
      let result_final = parseInt(result.toFixed(0));
      let starAverage = [];

      if (starSum > 0) {
        for (let i of [0, 1, 2, 3, 4]) {
          const av = (starCount[i] / starSum) * 100;
          starAverage.push(av.toFixed(0));
        }
      } else starAverage = [0, 0, 0, 0, 0];
      const totalRatings = ratings.length;
      (ratings.length > 8) ? ratings = ratings.slice(0, 8) : null;
      const obj = { starCount, starAverage , result_final ,totalRatings, ratings}

      ctx.send(obj);

    },

    async GetUserRate(ctx){
      const id_formation = ctx.params.id_formation;
      let decoded = jwt_decode(ctx.request.header.authorization);
      const userId = decoded.id;
      
      const rating = await strapi.entityService.findMany('api::rating.rating', {
        filters: {
          formation: id_formation,
          user : userId
        },

       fields : ["id","rate","comment"],
       limit : 1
      });
      if(rating.length > 0){
        ctx.send(rating[0]);

      }else{
        ctx.send(null);

      }
    },

 

  async MyRating(ctx) {
    const id_rating = ctx.params.id_rating
    let decoded = jwt_decode(ctx.request.header.authorization);
    const userId = decoded.id;
    dayjs.locale('fr')
    const date_tz = dayjs().format()
    let data = { ...ctx.request.body.data };
    if(id_rating > 0){
      data.user = userId
      data.updatedAt = date_tz
      const update = await strapi.entityService.update("api::rating.rating", id_rating, { data: { ...data } });
      ctx.send(update)
    }else{
      data.user = userId
      data.publishedAt = date_tz
      const post = await strapi.entityService.create("api::rating.rating", { data: { ...data } })
      ctx.send(post);
    }
   


  },

  })
);



