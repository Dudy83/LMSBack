'use strict';
const dayjs = require('dayjs');
const jwt_decode = require("jwt-decode");

/**
 *  newsletter controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::newsletter.newsletter',({strapi})=> ({


    async Subscribe(ctx){
        dayjs.locale('fr')
      const date_tz =  dayjs().format()
      let data = {...ctx.request.body.data};         
 
      data.publishedAt = date_tz
    let exist = await strapi.entityService.findMany("api::newsletter.newsletter",{
      filters : {
        email : data.email
      },
      limit : 1,
      fields : ["id"]
    });
    if(exist.length > 0){
        
      ctx.send(true);
    }else{
        const post =  await strapi.entityService.create("api::newsletter.newsletter",{data : {...data}})
        ctx.send(post);  
    }
    },
async Exist(ctx){
  let data = {...ctx.request.body.data};         
  let exist = await strapi.entityService.findMany("api::newsletter.newsletter",{
    filters : {
      email : data.email
    },
    limit : 1,
    fields : ["id"]
  });
  if(exist.length > 0){
    ctx.send(true);
  }else{
    ctx.send(false);

  }
},
    async Update(ctx){
      let decoded = jwt_decode(ctx.request.header.authorization);
      const userId = decoded.id;
      let data = {...ctx.request.body.data};         
      dayjs.locale('fr')
      const date_tz =  dayjs().format()

      if(userId){
        let exist = await strapi.entityService.findMany("api::newsletter.newsletter",{
          filters : {
            email : data.email
          },
          limit : 1,
          fields : ["id"]
        });
        if(exist.length > 0){
          data.updatedAt = date_tz
          const update = await strapi.entityService.update("api::newsletter.newsletter", exist[0].id, { data: { ...data } });

          ctx.send(update);  
        }else{
          data.publishedAt = date_tz

          const post =  await strapi.entityService.create("api::newsletter.newsletter",{data : {...data}})
          ctx.send(post);  
        }
      }

    }


} )

);
