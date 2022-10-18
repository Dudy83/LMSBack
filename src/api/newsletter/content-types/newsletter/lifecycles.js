module.exports = {

    async afterCreate(event) {

      const { result, params  } = event;
      const email = params.data.email;
      const templateId = 4;
      to = email
      from = "contact@pmemanageur.com"
      replyTo = email
      subject = "Bienvenue sur la NewsLetter Efia"
      userData = {
  
      email: email
      }
      try {
      await strapi.plugin("email-designer").service('email').sendTemplatedEmail({
          to : to,
          from : from,
          replyTo : replyTo,
      },{   
        templateReferenceId: templateId,
          subject: subject
       
       
      });
      } catch (err) {
     return strapi.log.debug('📺: ', err);
      }

  }

};