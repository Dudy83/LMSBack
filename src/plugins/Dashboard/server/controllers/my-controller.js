'use strict';

const { createWebhookStore } = require("@strapi/strapi/lib/services/webhook-store");
const dayjs = require('dayjs');

module.exports = {
  async Categs(ctx) {
    let categs = await strapi.entityService.findMany('api::formations-categorie.formations-categorie', {
      fields: ["id", "title"]
    })
    ctx.send(categs)
  },
  async InfoFormation(ctx) {
    let id_formation = ctx.params.id_formation;
    let formations = await strapi.entityService.findMany('api::formation.formation', {
      filters: {

        id: id_formation

      },
      populate: {
        enseignant: {
          fields: ["id", "username", "email"]

        },
        sessions: {
          fields: ["id", "titre", "date_start", "date_finish"],
          sort: { id: 'DESC' },
        },
        commandes_formations: {
          fields: ["with", "totalPrice", "payement", "createdAt", "publishedAt", "updatedAt"],
          sort: { id: 'DESC' },
        },
        Modules: {
          populate: {
            module: {
              fields: ["id", "titre", "tempsMin,tempsMax"],
              populate: {
                Activites: {
                  populate: {
                    activite: {
                      fields: ["id", "titre", "tempsMin,tempsMax"],
                      populate: {
                        activiteCategorie: {
                          fields: ["name"]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      fields: ["id", "title"]
    })
    ctx.send(formations);
  },
  async StatsCardFormation(ctx) {
    let data = { ...ctx.request.body.data };
    let sessions = [];
    let formations = [];
    let orders = [];
    const date_start = (data?.date_start) ? {date_start : { $gte : data?.date_start }} : null ;
    const date_end = (data?.date_end) ? {date_finish : { $lte : data?.date_end }}  : null;
    const id = ( data?.id_category.length > 0) ? {id : { $in : data.id_category }} : null ;

      formations = await strapi.entityService.findMany('api::formations-categorie.formations-categorie', {
        filters: {

         ...id,
          formations : {
            sessions : {
            ...date_start,
            ...date_end
            }
          }


        },
        populate: {
          formations: {
            fields: ["id", "title", "slug", "totalCourseMinutes", "showFormation"]

          }
        },
        fields: ["id", "title"]
      })
      sessions = await strapi.entityService.findMany('api::session.session', {
        filters: {
          formation: {
            formations_category: {
              ...id,
            }
          },
          ...date_start,
          ...date_end
        },

        fields: ["id", "titre", "date_start", "date_finish"],
        sort: { id: 'DESC' },

      });
      orders = await strapi.entityService.findMany('api::order.order', {
        filters: {
          formation: {
            formations_category: {
              ...id,
            },
            sessions : {
              ...date_start,
              ...date_end
           
            }
          }
        },

        fields: ["with", "totalPrice", "payement", "createdAt", "publishedAt", "updatedAt"],
        sort: { id: 'DESC' },
      });

    let StatusOrder = {};
    let StatusSessions = { open: [], close: [] };
    let FinalOrder = {}
    if (orders.length > 0) {
      orders.forEach((el) => {


        if (StatusOrder[el.payement]) {
          StatusOrder[el.payement].push(el)
        } else {
          StatusOrder[el.payement] = [el]
        }
      })

      Object.keys(StatusOrder).forEach((dd) => {
        let totalPrice = 0;
        let WithType = {}
        StatusOrder[dd].forEach((order) => {

          totalPrice += order.totalPrice;
          if (WithType[order.with]) {
            WithType[order.with] += 1
          } else {
            WithType[order.with] = 1;
          }
        })
        FinalOrder[dd] = { totalPrice: totalPrice, WithType: WithType }
      })


    }
    if (sessions.length > 0) {
      const date_now = dayjs(new Date()).unix() * 1000;

      sessions.forEach((el) => {
        let dateFinish = new Date(el.date_finish).getTime();
        let dateStart = new Date(el.date_start).getTime();
        if (date_now <= dateFinish && date_now >= dateStart) {
          StatusSessions.open.push(el);
        } else {
          StatusSessions.close.push(el);

        }

      })

    }
    ctx.send({ StatusOrder: FinalOrder, StatusSessions: StatusSessions, formations: formations })


  },

  async usersInfo(ctx) {
    const data = { ...ctx.request.body.data };
    let type = data.type;
    const createdAt_start = (data?.createdAt_start) ? {createdAt : { $gte : data?.createdAt_start }} : null ;
    const createdAt_end = (data?.createdAt_end) ? {createdAt : { $lte : data?.createdAt_end }}  : null;

    let prospects = [];
     let users = [];
 
    (type.length == 0 || type.find((el)=> el.includes("prospect"))) ?
      prospects = await strapi.entityService.findMany('api::prospect.prospect', {
        filters : {
          ...createdAt_start,
          ...createdAt_end
        },
        populate: {
          formations: {
            fields: ["title", "slug", "price"],

            populate: {
              formations_category: {
                fields: ["title", "slug", "icon", "buttonIcon"]
              },
              image: {
                fields: ["url"]
              }
            }
          }
        },
        fields: ["name", "phone", "email", "Status", "createdAt", "updatedAt"],
        sort: { id: 'DESC' },
      }) : null;


    (type.length == 0 || type.find((el)=> el.includes("client"))) ? users = await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters : {
        ...createdAt_start,
        ...createdAt_end
      },
      populate: {
        avatar: {
          fields: ["url"]
        }
      },
      fields: ["username", "email", "phoneNumber", "Profession"],
    }) : null;

    ctx.send({ utilisateurs: users, prospects: prospects });





  },
  async MenuDoc(ctx) {
    let menu = await strapi.entityService.findMany('api::documentation.documentation', {
      populate: {
        Sections: {
          fields: ["titre"],

          populate: {
            content: {
              fields: ["titre"]
            },

          }
        }
      },

    })
    ctx.send(menu)

  },
  async RecupArticle(ctx) {
    const data = { ...ctx.request.body.data };
    const id = data.id
    const id_section = data.id_section

    let article = await strapi.entityService.findMany('api::documentation.documentation', {

      populate: {
        Sections: {
          filters: {
            id: {
              $eq: id_section
            }
          },
          fields: ["titre"],

          populate: {
            content: {
              fields: ["titre", "text"],
              filters: {
                id: {
                  $eq: id
                }
              },
              populate: {
             
                admin_user : {
                  fields : ["firstname","lastname","email"]
                }
              },
              limit: 1
            },


          },
          limit: 1
        }
      },

    })


    ctx.send(article);
  }





};
