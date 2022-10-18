"use strict";

/**
 *  activite controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const jwt_decode = require("jwt-decode");

module.exports = createCoreController(
  "api::activite.activite",
  ({ strapi }) => ({

    async getActiviteContent(ctx) { //here secure
      const id_activity = ctx.params.id_activity;
      const id_session = ctx.params.id_session;
      const id_formation = ctx.params.id_formation
      let decoded = jwt_decode(ctx.request.header.authorization); 
      const userId = decoded.id;   
      const session = await strapi.db.query("api::session.session").findOne({
        select : ["id"],
        where : {users_permissions_users : userId, formation: id_formation, id : id_session}
      });
      
      if(session){

      
      const programme = await strapi.db
        .query("api::activite.activite")
        .findOne({
          select: ["id"],
          populate: ["contenu", "contenu.reponse", "contenu.question_contenu", "contenu.question_contenu.media"],
          where: { id: id_activity },
        });

      ctx.send(programme);
    }else{
      ctx.send(null)
    }
    },
    
  })
);
