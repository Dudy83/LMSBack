const moment = require('moment');
const jwt_decode = require("jwt-decode");
const dayjs = require('dayjs');
const generator = require('generate-password');

module.exports = (plugin) => {
  plugin.controllers.user.byrole = async (ctx) => {
    const id = ctx.params.id;
    let users = await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters: {
        role: id
      },
      populate: {
        avatar: {
          fields: ["url"]
        }
      },
      fields: ["username", "email", "phoneNumber", "Profession", "biography", "facebook", "twitter", "linkedin", "instagram"],
    });

    ctx.send(users);
  };

  plugin.controllers.user.ForgetPassword = async (ctx) => {
    const email = ctx.params.email;
    const user = await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters: {
        email: email
      },
      limit : 1,
      fields: ["id","username", "email"],
    });
    if(user){
      let password = generator.generate({
        length: 10,
        numbers: true
      });
      dayjs.locale('fr')
      const date = dayjs().format("DD/MM/YYYY")
      const templateId = 12;
      to = email
      from = "contact@pmemanageur.com"
      replyTo = email
      subject = "Modification de votre mot de passe " + date;
     
      const send =   await strapi.plugin("email-designer").service('email').sendTemplatedEmail({
            to : to,
            from : from,
            replyTo : replyTo,
        },{   
          templateReferenceId: templateId,
            subject: subject
        },
        {
       
          USER: {
            username:  user[0].username,
            email : user[0].email,
            password : password,
            
           
          },

        
        });
        dayjs.locale('fr')
        const date_now = dayjs(new Date()).unix() * 1000;
          let updatedAt = date_now

        const update = await strapi.entityService.update("plugin::users-permissions.user", user[0].id, {
          data: {
             password :  password,
              updatedAt : updatedAt
            
          }
        });

    ctx.send(update);

    }else{
      ctx.send(null)
    }

 
  };

  plugin.controllers.user.getUserSessions = async (ctx) => {
    let decoded = jwt_decode(ctx.request.header.authorization);
    const userId = decoded.id;
    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        select: [
          "id",
        ],
        where: {
          id: userId,
        },
        populate: ["sessions", "sessions.formation", "sessions.formation.formations_category", "sessions.formation.image"]
      });

    ctx.send(user);
  };

  plugin.controllers.user.CanAccessFormationCommunity = async (ctx) => {

    let decoded = jwt_decode(ctx.request.header.authorization); 
    const userId = decoded.id;  
    const slug =   ctx.params.slug;

    const session_exist = await strapi.entityService.findMany('api::session.session', { 
      filters : { 
          users_permissions_users: userId,
          formation : {
         
              slug : {
                $eq : slug
              }

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
  if(session_exist.length > 0 && session_exist[0].formation ){
    ctx.send({
      etat: true,
    });
  }else{
    ctx.send({
      etat: false,
      msg: "Vous n'avez pas accès à cette formation",
      slug: slug
    });

  }
  };

  plugin.controllers.user.CanAccesSession = async (ctx) => {
    let decoded = jwt_decode(ctx.request.header.authorization);
    const userId = decoded.id;

    const slug = ctx.params.slug;
    const id_session = ctx.params.id_session;
    let session = await strapi.entityService.findMany("api::session.session", {
      filters: {
        id : id_session,
        users_permissions_users: userId,
      },
      fields: ["id", "date_finish", "date_start"],
      sort: {
        id: 'DESC'
      },
      limit : 1

    });
    
    const date_now = dayjs(new Date()).unix() * 1000;
    

    if (session.length > 0) {
      session = session[0];
      let dateEnd = new Date(session.date_finish).getTime();
      let dateStart = new Date(session.date_start).getTime();

      if (dateEnd < date_now) {

        ctx.send({
          etat: false,
          msg: "Vous n'avez plus accès à cette formation"
        });

      } else {
        if (dateStart <= date_now) {

          ctx.send({
            etat: true,
            session: {
              id: session.id
            }
          });

        } else {
          ctx.send({
            etat: false,
            msg: "La session à cette formation n'a pas débutée"
          });

        }

      }
    } else {
      ctx.send({
        etat: false,
        msg: "Vous n'avez pas accès à cette formation",
        slug: slug
      });


    }




  };
  plugin.controllers.user.DetailCourse = async (ctx) => {
    let decoded = jwt_decode(ctx.request.header.authorization);
    const userId = decoded.id;

    const id_formation = ctx.params.id_formation;
    const session = await strapi.db
      .query("api::session.session")
      .findOne({

        where: {
          users_permissions_users: userId,
          formation: id_formation
        },
      });
    dayjs.locale('fr')
    const date_now = dayjs(new Date()).unix() * 1000;

    if (session != undefined) {
      let dateEnd = new Date(session.date_finish).getTime();
      let dateStart = new Date(session.date_start).getTime();

      if (dateEnd < date_now) {

        ctx.send({
          etat: false
        });
      } else {
        if (dateStart <= date_now) {

          const logs = await strapi.db
            .query("api::activites-log.activites-log")
            .findOne({
              select: [
                "id",
              ],
              where: {
                users_permissions_user: userId,
                session: session.id

              }
            });

          if (logs != undefined) {
            ctx.send({
              etat: true,
              start: true,
              session : session.id
            });

          } else {
            ctx.send({
              etat: true,
              start: false,
              session : session.id
            });

          }

        } else {
          ctx.send({
            etat: true,
            date_start: session.date_start,
            session : session.id
          });
        }

      }
    } else {
      ctx.send({
        etat: false,
        session : 0
      });
    }
  };

  plugin.controllers.user.image = async (ctx) => {

    let decoded = jwt_decode(ctx.request.header.authorization);
    const userId = decoded.id;


    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        select: [
          "id",
        ],
        where: {
          id: userId,
        },
        populate: ["avatar"]
      });
    ctx.send(user);
  };

  plugin.controllers.user.GetInfoProfil = async (ctx) => {

    let decoded = jwt_decode(ctx.request.header.authorization);
    const userId = decoded.id;

    let user = await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters: {
        id: userId
      },
      populate: {
        avatar: {
          fields: ["url"]
        }
      },
      fields: ["username", "email", "phoneNumber", "Profession", "biography", "facebook", "twitter", "linkedin", "instagram"],
    });

    ctx.send(user);

  };


  plugin.controllers.user.UpdateInfoProfil = async (ctx) => {

    let decoded = jwt_decode(ctx.request.header.authorization);
    const userId = decoded.id;
    dayjs.locale('fr')
    const date_tz = dayjs().format()
    let data = {
      ...ctx.request.body.data
    };
    data.updatedAt = date_tz

    const update = await strapi.entityService.update("plugin::users-permissions.user", userId, {
      data: {
        ...data
      }
    });


    ctx.send(update);


  };
  plugin.controllers.user.AddProspect = async (ctx) => {

    dayjs.locale('fr')
    const date_tz = dayjs().format()
    let data = {
      ...ctx.request.body.data
    };

    data.publishedAt = date_tz

    let exist = await strapi.entityService.findMany("plugin::users-permissions.user", {
      filters: {
        email: data.email
      },
      limit: 1,
      fields: ["id"]
    });
    if (exist.length > 0) {
      ctx.send(true);
    } else {

      const post = await strapi.entityService.create("api::prospect.prospect", {
        data: {
          ...data
        }
      })
      ctx.send(post);
    }



  };

  plugin.controllers.user.sendInvoice = async (ctx) => {
    let data = {
      ...ctx.request.body.data
    };
    dayjs.locale('fr')
    const date = dayjs().format("DD/MM/YYYY")

    let decoded = jwt_decode(ctx.request.header.authorization);
    const userId = decoded.id;

    if(userId && data.order &&  data.order.formation && data.user)  {

      const templateId = 10;
      to = data.user.email
      from = "contact@pmemanageur.com"
      replyTo = data.user.email
      subject = "Facture du " + date;
      const Tva = Math.round(data.order.formation.price * 0.21);
      const TotalTva =  Math.round(data.order.formation.price + (data.order.formation.price * 0.21));
  
      const send =   await strapi.plugin("email-designer").service('email').sendTemplatedEmail({
            to : to,
            from : from,
            replyTo : replyTo,
        },{   
          templateReferenceId: templateId,
            subject: subject
        },
        {
          info: {
            date : date,
            status : data.order.payement,
            TotalW : data.order.formation.price + " €",
            TotalTva : Tva + " €",
            Total : TotalTva + " €"

          },
          USER: {
            username:  data.user.username,
            email : data.user.email,
            adresse : data.user.biography,
            phone : data.user.phoneNumber
           
          },
          formation: {
            info: data.order.formation.title + " " + data.order.formation?.formations_category?.title,
            price :  data.order.formation.price + " €",
            quantity : 1,
            Total : data.order.formation.price + " €"
          }
        
        });
        
        ctx.send(send)
    }else{
      ctx.send(null)
    }
  }



  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/forgetpassword/:email",
    handler: "user.ForgetPassword",
  });
  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/session",
    handler: "user.getUserSessions",
  });
  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/formation/community/:slug",
    handler: "user.CanAccessFormationCommunity",
  });
  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/session/formation/:slug/:id_session",
    handler: "user.CanAccesSession",
  });
  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/byrole/:id",
    handler: "user.byrole",
  });
  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/image",
    handler: "user.image",
  });
  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/detaillogcourse/:id_formation",
    handler: "user.DetailCourse",
  });
  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/user/recupInfo",
    handler: "user.GetInfoProfil",
  });
  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/addprospect",
    handler: "user.AddProspect",
  });
  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/user/UpdateInfoProfil",
    handler: "user.UpdateInfoProfil",
  });

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/user/sendInvoice",
    handler: "user.sendInvoice",
  });

  return plugin;
};
