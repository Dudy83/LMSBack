"use strict";

/**
 *  q-and-a controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const jwt_decode = require("jwt-decode");

module.exports = createCoreController("api::q-and-a.q-and-a", ({ strapi }) => ({
  async getByFormation(ctx) {
    const id = ctx.params.id;
    
    const slug = ctx.params.slug;

      let decoded = jwt_decode(ctx.request.header.authorization); 
      const userId = decoded.id;   
      const session_exist =  await await strapi.entityService.findMany('api::session.session', { 
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
 

    const QandA =  await strapi.entityService.findMany('api::q-and-a.q-and-a', { 
      filters :{
        id : id
      },
  
      fields : ["id","content","titre","publishedAt"],
      populate : {
        media :{
          fields : ["url"]
        },
        users_permissions_user : {
          fields : ["id","username","email","Profession"],
          populate : { 
            avatar : {
            fields:  ["url"]
          }
          }

        },
        like  :{
          populate :  {
            users_permissions_user : {
              fields : ["id","username","email","Profession"],
              populate : { 
                avatar : {
                fields:  ["url"]
              }
              }
            }
          }
        },
        reponse : {
          fields : ["reponse"],
          populate : {
            users_permissions_user : {
              fields : ["id","username","email","Profession"],
              populate : { 
                avatar : {
                fields:  ["url"]
              }
              }

            },
            like  :{

              populate : {
                users_permissions_user : {
                  fields : ["id","username","email","Profession"],
                  populate : { 
                    avatar : {
                    fields:  ["url"]
                  }
                  }
                }

              }
          
            }
          }
        }
      },
      limit : 1,
    });
    
    ctx.send(QandA);
  }else{
    ctx.send(null);
  }
  },

  async getForumByFormation(ctx) {
    

      let decoded = jwt_decode(ctx.request.header.authorization); 
      const userId = decoded.id;  
      const slug = ctx.params.slug;
      const session_exist =  await await strapi.entityService.findMany('api::session.session', { 
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
 

    const QandA =  await strapi.entityService.findMany('api::q-and-a.q-and-a', { 
      filters : { 
        formation: session_exist[0].formation.id
    },
  
      fields : ["id","content","titre","publishedAt"],
      populate : {
        media :{
          fields : ["url"]
        },
        users_permissions_user : {
          fields : ["id","username","email","Profession"],
          populate : { 
            avatar : {
            fields:  ["url"]
          }
          }

        },
        like  : true

      },
      sort : { id : 'DESC'}
    });
    
    ctx.send(QandA);
  }else {
    ctx.send(null);
  }
}
}));
