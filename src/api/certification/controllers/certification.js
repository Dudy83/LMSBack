'use strict';

/**
 *  certification controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const jwt_decode = require("jwt-decode");
const dayjs = require('dayjs');

module.exports = createCoreController('api::certification.certification',
({ strapi }) => ({
  async SendCertif(ctx) {
    let data = {
        ...ctx.request.body.data
      };
      dayjs.locale('fr')
      const date = dayjs().format("DD/MM/YYYY")
  
      let decoded = jwt_decode(ctx.request.header.authorization);
      const userId = decoded.id;
      if(userId && data.user && data.formation && data.certification)  {
          
      const templateId = data.certification.idTemplate;
     let to = data.user.email
     let from = "contact@pmemanageur.com"
     let replyTo = data.user.email
     let subject = "Certification " + data.formation.title;

     dayjs.locale('fr')
     const date_start = new Date(data.formation.date_start).toLocaleDateString('fr')
     const date_finish = new Date(data.formation.date_finish).toLocaleDateString('fr')
      const send =   await strapi.plugin("email-designer").service('email').sendTemplatedEmail({
            to : to,
            from : from,
            replyTo : replyTo,
        },{   
          templateReferenceId: templateId,
            subject: subject
        },
        {
            info : {
                date : date,
            },
            certification : {
                Logo : data.certification?.Logo?.url,
                content : data.certification.Description
            },
   
          USER: {
            username:  data.user.username,

           
          },
          formation : {
              title : data.formation.title,
              session  : data.formation.session,
              date_start : date_start,
              date_end : date_finish

          }

        
        });
        
        ctx.send("Send");

      }else{
          ctx.send(null);
      }

  }
})
);
