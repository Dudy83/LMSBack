module.exports = {

    async afterCreate(event) {

      const { result, params  } = event;
      const email = params.data.email;
      const templateId = 5;
      to = email
      from = "contact@pmemanageur.com"
      replyTo = email
     
     
      try {
      await strapi.plugin("email-designer").service('email').sendTemplatedEmail({
          to : to,
          from : from,
          replyTo : replyTo,
      },{   
        templateReferenceId: templateId,
         
       
      });
      } catch (err) {
     return strapi.log.debug('📺: ', err);
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