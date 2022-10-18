'use strict';

/**
 *  session controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const jwt_decode = require("jwt-decode");
const dayjs = require('dayjs');

module.exports = createCoreController('api::session.session',
({ strapi }) => ({
    
    async Community(ctx){
        let decoded = jwt_decode(ctx.request.header.authorization); 
        const userId = decoded.id;
        const sessions = await strapi.entityService.findMany('api::session.session', {
          populate : {
              formation : {
                populate : {
                    ratings : {
                        fields : ["rate","comment"],
                        populate : { 
                          user : {
                            fields : ["id"]
                          }
                        }
                      },
                      image : { 
                          fields : ["url"]
                        },
                        formations_category : {
                          fields : ["id","title", "icon", "slug", "buttonIcon"]
                        },
              
                },
                fields: ["id","totalCourseMinutes","slug","title"]

              }
          },
          filters : {
            users_permissions_users : userId
          },        
          fields : ["id","date_start"],
          sort : { id : 'DESC'},
    
        });
        let categories_unique = {};
        const date_now = dayjs(new Date()).unix() * 1000;

        sessions.forEach((session)=>{ 

            let keysformations = Object.keys(categories_unique);
            const categorie = (session.formation.formations_category) ? session.formation.formations_category : 
            {
              id : 0,
              title : "Aucun",
              icon : "?",
              slug : "Aucun"
            }
            if(!keysformations.find((id)=> id == categorie.id )){
              let TotalRate = 0;
              session.formation.ratings.forEach((rating) =>  TotalRate += rating.rate);
              let result_final = (session.formation.ratings.length > 0) ? TotalRate / session.formation.ratings.length : 0;
              let dateStart = new Date(session.date_start).getTime();
              (dateStart <= date_now) ?  session.formation["can"] = true :  session.formation["can"] = false; 
              session.formation["result_rate"] = parseInt(result_final.toFixed(0));
               session.formation["ratings"] = session.formation.ratings.filter((el)=>el.user.id == userId );
                categories_unique[categorie.id] = {
                    id : categorie.id, 
                    title : categorie.title,
                    icon : categorie.icon,
                    slug : categorie.slug,
                    formations : [session.formation]

                };
            }else{
              if(!categories_unique[categorie.id].formations.find((el)=> el.id == session.formation.id)){
                let TotalRate = 0;
                session.formation.ratings.forEach((rating) =>  TotalRate += rating.rate);
                let result_final = (session.formation.ratings.length > 0) ? TotalRate / session.formation.ratings.length : 0;
                let dateStart = new Date(session.date_start).getTime();
                (dateStart <= date_now) ?  session.formation["can"] = true :  session.formation["can"] = false; 

              session.formation["result_rate"] = parseInt(result_final.toFixed(0));
              session.formation["ratings"] = session.formation.ratings.filter((el)=>el.user.id == userId );

                categories_unique[categorie.id].formations.push(session.formation);       
              }
                
            }
        })

        if(Object.keys(categories_unique).length > 0 ){
            ctx.send(categories_unique);

        }else{
          
            ctx.send(null);

        }
  
      }
    
})
);