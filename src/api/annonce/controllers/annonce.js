'use strict';

/**
 *  annonce controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const jwt_decode = require("jwt-decode");


module.exports = createCoreController('api::annonce.annonce',
({ strapi }) => ({

    async AnnonceCommunity(ctx){
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
            const annonces =   await strapi.entityService.findMany('api::annonce.annonce', { 
                filters : { 
                    formation: session_exist[0].formation.id
                },
                fields : ["titre","slug","content","publishedAt"],
                populate : {
                    enseignant : {
                        fields : ["username","email","phoneNumber","Profession"],
                        populate : {
                            avatar : {
                               fields : ["url"]
                            }
                        }
                    },
                    media : {
                        fields : ["url"]
                    }
                },
                sort : { id : 'DESC'}

            });
            ctx.send(annonces)
        }else{
            ctx.send(null);
        }
 

    }

})

);
