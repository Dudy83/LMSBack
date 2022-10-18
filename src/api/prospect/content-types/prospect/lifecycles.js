const dayjs = require('dayjs');
const generator = require('generate-password');
const bcrypt = require('bcryptjs');
const Boom = require('boom');

module.exports = {

    async afterCreate(event) {
      const { result, params  } = event;

      const email = params.data.email;
      const name = params.data.name
      const formations = params.data.formations;
      const templateId = 2;
      to = email
      from = "contact@pmemanageur.com"
      replyTo = email
      subject = "Votre demande a bien été prise en compte ! "
      userData = {
  
      email: email
      }
      let InfoFormations = [];
      if(formations.length > 0){
        InfoFormations = await strapi.entityService.findMany('api::formation.formation',{
          filters : {
            id : formations
          },
   
          fields : ["title","totalCourseMinutes", "price"],
              });

      }
      
     (InfoFormations.length > 0) ? InfoFormations.forEach((el)=>{
        el.totalCourseMinutes = Math.round(el.totalCourseMinutes / 60);
      }) : null;
      
      try {
      await strapi.plugin("email-designer").service('email').sendTemplatedEmail({
          to : to,
          from : from,
          replyTo : replyTo,
      },{   
        templateReferenceId: templateId,
          subject: subject
      },
      {
     
        USER: {
          name: name,
         
        },
        order: {
          formations: InfoFormations,
        }
      });
      } catch (err) {
     return strapi.log.debug('📺: ', err);
      }

  },

  async afterUpdate(event) {
    const { result, params  } = event;
    const status = params.data.Status;
    const email = params.data.email;
    const formations = params.data.formations;
  

    if (status.toLowerCase().includes("inscrit")){
      let InfoFormations = [];
      if(formations.length > 0){
        InfoFormations = await strapi.entityService.findMany('api::formation.formation',{
          filters : {
            id : formations
          },
   
          fields : ["id","title","totalCourseMinutes", "price"],
              });
              (InfoFormations.length > 0) ? InfoFormations.forEach((el)=>{
                el.totalCourseMinutes = Math.round(el.totalCourseMinutes / 60);
              }) : null;
  
      }
      const email = params.data.email
      let exist = await strapi.entityService.findMany("plugin::users-permissions.user",{
        filters : {
          email : email
        },
        populate: {
          commandes_formations :  {
            populate : {
              formation : {
                fields : ["id"]
              }
            }
          }
        },
        limit : 1,
        fields : ["id"]
      });


      if(exist.length > 0){
        dayjs.locale('fr')
        const date_tz =  dayjs().format()
       
      if(exist[0].commandes_formations.length > 0 ){
       (InfoFormations.length > 0) ? InfoFormations.forEach(async (formation)=>{ 
          if(!exist[0].commandes_formations.find((el)=> el.formation.id == formation)){
            let data = {payement : "en attente", with : "Crédits", formation: formation.id, totalPrice: formation.price};         
            data.user = exist[0].id;
            data.publishedAt = date_tz   
            const post =  await strapi.entityService.create("api::order.order",{data : {...data}})
          }
       }) : null;
      }else{
        (InfoFormations.length > 0) ? InfoFormations.forEach(async (formation)=>{ 
          let data = {payement : "en attente", with : "Crédits", formation: formation.id, totalPrice: formation.price};         
          data.user = exist[0].id;
          data.publishedAt = date_tz   
          const post =  await strapi.entityService.create("api::order.order",{data : {...data}})
        }) : null;

      }
                const templateId = 8;
        to = email
        from = "contact@pmemanageur.com"
        replyTo = email
        subject = "Bienvenue sur Efia"
         
        try {
          await strapi.plugin("email-designer").service('email').sendTemplatedEmail({
              to : to,
              from : from,
              replyTo : replyTo,
          },{   
            templateReferenceId: templateId,
              subject: subject
          },
          {
         
            USER: {
              name:  params.data.name,
             
             
            },
            order: {
              formations: InfoFormations,
            }
          
          });
          } catch (err) {
         return strapi.log.debug('📺: ', err);
          }
      }else{
        
        let password = generator.generate({
          length: 10,
          numbers: true
        });
        const profession = (params.data.profession) ? params.data.profession : "";
        const phoneNumber = (params.data.phone) ? params.data.phone : "";
        const username = (params.data.name) ? params.data.name : "non renseigné";
        const hashpassword = bcrypt.hash(password, 10);

        var data = {username : username, phoneNumber : phoneNumber, email : email,
        Profession : profession , confirmed: true, password : hashpassword, avatar : 205, role : 1 }
        dayjs.locale('fr')
       const date_tz =  dayjs().format()
        data.publishedAt = date_tz
        const post =  await strapi.query("plugin::users-permissions.user").create({data : {...data}});

        (InfoFormations.length > 0) ? InfoFormations.forEach(async (formation)=>{ 
          let order = {payement : "en attente", with : "Crédits", formation: formation.id,totalPrice: formation.price};         
          order.user = post.id;
          order.publishedAt = date_tz   
          const order_post =  await strapi.entityService.create("api::order.order",{data : {...order}})  
        }) : null; 
      
        const templateId = 6;
        to = email
        from = "contact@pmemanageur.com"
        replyTo = email
        subject = "Bienvenue sur Efia"
         
        try {
          await strapi.plugin("email-designer").service('email').sendTemplatedEmail({
              to : to,
              from : from,
              replyTo : replyTo,
          },{   
            templateReferenceId: templateId,
              subject: subject
          },
          {
         
            USER: {
              name:  params.data.name,
              email : email,
              password : password
             
            },
            order: {
              formations: InfoFormations,
            }
          
          });
          } catch (err) {
         return strapi.log.debug('📺: ', err);
          }
      }
    }
  },
  async beforeCreate(event) {

    const { result, params  } = event;
    return params.data.id_admin_user =  params.data.admin_user;       
      

},
async beforeUpdate(event) {
  const { result, params  } = event;
  return params.data.id_admin_user =  params.data.admin_user;       
}

};