"use strict";

/**
 *  formation controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const jwt_decode = require("jwt-decode");

// module.exports = createCoreController('api::formation.formation');

module.exports = createCoreController(
  "api::formation.formation",
  ({ strapi }) => ({
    async getProgrammeExist(ctx) {
      const id = ctx.params.id;
      const program = await strapi.db
        .query("api::formation.formation")
        .findOne({
          select: ["id"],
          populate: [
            "Modules.module",
            "Modules.module.Activites",
            "Modules.module.Activites.activite",
            "Modules.module.Activites.activite.activiteCategorie",
            "Modules.module.Activites.activite",

          ],
          where: { id: id },
        });


      ctx.send(program);
    },

    async getCount(ctx) {
      const count = await strapi.db.query("api::formation.formation").count();

      ctx.send({ count });
    },

    async formationsByCategPreview(ctx) {
      const id = ctx.params.id;
      let decoded = (ctx.request.header && ctx.request.header.authorization) ? jwt_decode(ctx.request.header.authorization) : null;
      const userId = (decoded) ? decoded.id : null;
      let formations;
      if(userId){
       formations = await strapi.entityService.findMany('api::formations-categorie.formations-categorie', {
        filters: {
          id: id
        },
        populate: {
          formations: {
            fields: ["id", "title", "slug", "totalCourseMinutes", "price","showPrice"],

            populate: {
              image: {
                fields: ["url"]
              },
              formations_category: {
                fields: ["title", "icon", "slug","buttonIcon"]
              },
              commandes_formations: {
                filters: {
                  payement: {
                    $eq: "payé"
                  }
                }
              },
              financeurs: {
                fields: ["Url"],
                populate: {
                  Logo: {
                    fields: ["url"]
                  }
                }
              },
              Modules: {
                fields: ["id"]
              },
              ratings: {
                fields: ["rate"]
              }
            }
          }

        },

        sort: { id: 'DESC' },
        fields: ["title", "icon", "slug"]

      });
    }else{
      formations = await strapi.entityService.findMany('api::formations-categorie.formations-categorie', {
        filters: {
          id: id,
          showCategory : true
        },
        populate: {
          formations: {
            fields: ["id", "title", "slug", "totalCourseMinutes", "price","showPrice"],
            filters : { 
              showFormation : {
                $eq : true
              }
            },
            populate: {
              image: {
                fields: ["url"]
              },
              formations_category: {
                fields: ["title", "icon", "slug","buttonIcon"],
                filters : { 
                  showCategory : {
                    $eq : true
                  }
                }
              },
              commandes_formations: {
                filters: {
                  payement: {
                    $eq: "payé"
                  }
                }
              },
              financeurs: {
                fields: ["Url"],
                populate: {
                  Logo: {
                    fields: ["url"]
                  }
                }
              },
              Modules: {
                fields: ["id"]
              },
              ratings: {
                fields: ["rate"]
              }
            }
          }

        },

        sort: { id: 'DESC' },
        fields: ["title", "icon", "slug"]

      });
    }
      formations[0].formations.forEach((formation) => {
        let totalRate = 0;

        (formation.ratings.length > 0) ? formation.ratings.forEach((el) => {
          totalRate = totalRate + el.rate;
        }) : null;
        const result = formation.ratings.length > 0 ? totalRate / formation.ratings.length : 0;
        formation["rate_total"] = Math.round(result);
      })


      ctx.send(formations[0].formations);
    },

    async getProgramme(ctx) {
      const id = ctx.params.id;

      const programme = await strapi.db
        .query("api::formation.formation")
        .findOne({
          select: ["id"],
          populate: [
            "Modules.module",
            "Modules.module.Activites.activite",
            "Modules.module.Activites.activite.activiteCategorie",

          ],
          where: { id: id },
        });


      ctx.send(programme);
    },
    async getProgrammeSuivi(ctx) {
      const id_formation = ctx.params.id_formation;
      const id_session = ctx.params.id_session;
      let decoded = jwt_decode(ctx.request.header.authorization);
      const userId = decoded.id;

      const programme = await strapi.db
        .query("api::formation.formation")
        .findOne({
          select: ["id"],
          populate: [
            "Modules.module",
            "Modules.module.Activites.activite",
            "Modules.module.Activites.activite.activiteCategorie",

          ],
          where: { id: id_formation },
        });

      const activites_logs = await strapi.db
        .query("api::activites-log.activites-log")
        .findMany({
          select: ["id", "time", "done", "isActive"],
          populate: [
            "activite"
          ],
          where: { users_permissions_user: userId, session: id_session },
        });

      // filtre les modules vides
      const filteredModArray = programme.Modules.filter(el => el.module)
      programme.Modules = filteredModArray

      programme.Modules.forEach((el) => {

        let time_global = 0;
        let number_done = [];

        // filtre les activités vides
        const filteredActArray = el.module.Activites.filter(el => el.activite)
        el.module.Activites = filteredActArray

        el.module.Activites.forEach((el2) => {

          // console.log('el2', el2);
          const info = activites_logs.find((log) => log.activite.id == el2.activite.id);

          // gère le cas des activtés vides
          if (el2.id && el2.activite == null) {
            actIdToRemove.push(el2.id)
            return;
          }


          if (info) {
            el2.activite["done"] = info.done
            el2.activite["time"] = info.time
            el2.activite["isActive"] = info.isActive
            el2.activite["id_log"] = info.id;
            (info.done) ? number_done.push(el2.activite["id_log"]) : null;
          } else {
            el2.activite["done"] = false
            el2.activite["time"] = 0
            el2.activite["id_log"] = ""
            el2.activite["isActive"] = false
          }

          time_global = time_global + el2.activite["time"];

        })

        el.module["time"] = time_global;
        el.module["done"] = number_done;

      })

      //    https://www.youtube.com/embed/KHGdb9JrErY?start=14400&end=68400&autoplay=1

      ctx.send(programme);
    },
async getCommunityFormationPreview(ctx){
  let decoded = jwt_decode(ctx.request.header.authorization); 
  const userId = decoded.id;
  const slug = ctx.params.slug;
  const session_exist =   await strapi.entityService.findMany('api::session.session', { 
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
          }
      ,
      fields : ["id"],
      limit : 1
  });
  if(session_exist.length > 0  && session_exist[0].formation){
    const formation = session_exist[0].formation;
    const annonces =   await strapi.entityService.findMany('api::annonce.annonce', { 
      filters : { 
          formation: formation.id
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
      limit : 1,
      sort : { id : 'DESC'}

  });
  const QandA =  await strapi.entityService.findMany('api::q-and-a.q-and-a', { 
    filters : { 
      formation: formation.id
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
    limit : 1,
    sort : { id : 'DESC'}

  });
  
  let ratings = await strapi.entityService.findMany('api::rating.rating', {
    filters: {
      formation: formation.id,
    },
    populate : {
      user : {
        fields :  ["username"],
        populate : {
          avatar : {
            fields : ["url"]
          }
        }
      }
    },
    sort : { id : 'DESC'}
  });

const starCount = [0, 0, 0, 0, 0];
let totalRate = 0;

ratings.forEach((el) => {
  totalRate = totalRate + el.rate;

  const { rate } = el;
  if (rate > 0) starCount[rate - 1] = starCount[rate - 1] + 1;
});

const starSum = starCount.reduce((a, b) => a + b, 0);
const result = ratings.length > 0 ? totalRate / ratings.length : 0;
let result_final = parseInt(result.toFixed(0));
let starAverage = [];

if (starSum > 0) {
  for (let i of [0, 1, 2, 3, 4]) {
    const av = (starCount[i] / starSum) * 100;
    starAverage.push(av.toFixed(0));
  }
} else starAverage = [0, 0, 0, 0, 0];
const totalRatings = ratings.length;
ratings = ratings.find((el)=> el.user.id ==  userId) ? ratings.filter((el)=> el.user.id ==  userId) : ratings.slice(0,1) ;
const obj = { starCount, starAverage , result_final ,totalRatings, ratings}

  ctx.send({annonces : annonces, forum : QandA, avis : obj})
  }else{
    ctx.send(null);
  }
},
    async getSuggestion(ctx) {

      const id = ctx.params.id;
      let decoded = (ctx.request.header && ctx.request.header.authorization) ? jwt_decode(ctx.request.header.authorization) : null;
      const userId = (decoded) ? decoded.id : null;
      let suggest;
      if(userId){
    suggest = await strapi.entityService.findMany('api::formation.formation', {
        filters: {
          formations_category: id
        },
        populate: {
          image: {
            fields: ["url"]
          },
          formations_category: {
            fields: ["title", "icon", "slug","buttonIcon"]
          },
          commandes_formations: {
            filters: {
              payement: {
                $eq: "payé"
              }
            }
          },
          financeurs: {
            fields: ["Url"],
            populate: {
              Logo: {
                fields: ["url"]
              }
            }
          },
          Modules: {
            fields: ["id"]
          },
          ratings: {
            fields: ["rate"]
          }
        },

        fields: ["id", "title", "slug", "totalCourseMinutes", "price","showPrice"],
        sort: { id: 'DESC' },
        limit: 3
      });
    }else{
      suggest = await strapi.entityService.findMany('api::formation.formation', {
        filters: {
          formations_category: id,
          showFormation : true,
          formations_category : { 
            showCategory : {
              $eq : true
            }
          }
        },
        populate: {
          image: {
            fields: ["url"]
          },
          formations_category: {
            fields: ["title", "icon", "slug","buttonIcon"],
       
          },
          commandes_formations: {
            filters: {
              payement: {
                $eq: "payé"
              }
            }
          },
          financeurs: {
            fields: ["Url"],
            populate: {
              Logo: {
                fields: ["url"]
              }
            }
          },
          Modules: {
            fields: ["id"]
          },
          ratings: {
            fields: ["rate"]
          }
        },

        fields: ["id", "title", "slug", "totalCourseMinutes", "price","showPrice"],
        sort: { id: 'DESC' },
        limit: 3
      });
    }
      suggest.forEach((formation) => {
        let totalRate = 0;

        (formation.ratings.length > 0) ? formation.ratings.forEach((el) => {
          totalRate = totalRate + el.rate;
        }) : null;
        const result = formation.ratings.length > 0 ? totalRate / formation.ratings.length : 0;
        formation["ratings"] = formation.ratings.length;
        delete formation.rate;
        formation["rate_total"] = Math.round(result);
      })
      ctx.send(suggest);
    },

    async getFormationCards(ctx) {
      const limit = ctx.params.limit;
      let decoded = (ctx.request.header && ctx.request.header.authorization) ? jwt_decode(ctx.request.header.authorization) : null;
      const userId = (decoded) ? decoded.id : null;
      let formations;
      if(userId){
      formations = await strapi.entityService.findMany('api::formation.formation', {
        
        populate: {
          image: {
            fields: ["url"]
          },
          formations_category: {
            fields: ["title", "icon", "slug","buttonIcon"]
          },
          commandes_formations: {
            filters: {
              payement: {
                $eq: "payé"
              }
            }
          },
          financeurs: {
            fields: ["Url"],
            populate: {
              Logo: {
                fields: ["url"]
              }
            }
          },
          Modules: {
            fields: ["id"]
          },
          ratings: {
            fields: ["rate"],

          }
        },
        
        fields : ["id","title","slug","totalCourseMinutes","price"],
        sort : { id : 'DESC'},
        limit: limit
      });
    }else{
      formations = await strapi.entityService.findMany('api::formation.formation', {
        filters : {
          showFormation : true,
          formations_category : {
            showCategory : {
              $eq : true
            }
          }
        },
        populate: {
          image: {
            fields: ["url"]
          },
          formations_category: {
            fields: ["title", "icon", "slug","buttonIcon"],
          },
          commandes_formations: {
            filters: {
              payement: {
                $eq: "payé"
              }
            }
          },
          financeurs: {
            fields: ["Url"],
            populate: {
              Logo: {
                fields: ["url"]
              }
            }
          },
          Modules: {
            fields: ["id"]
          },
          ratings: {
            fields: ["rate"],

          }
        },
        
        fields : ["id","title","slug","totalCourseMinutes","price"],
        sort : { id : 'DESC'},
        limit: limit
      });
    }

      formations.forEach((formation) => {
        let totalRate = 0;

        (formation.ratings.length > 0) ? formation.ratings.forEach((el) => {
          totalRate = totalRate + el.rate;
        }) : null;
        const result = formation.ratings.length > 0 ? totalRate / formation.ratings.length : 0;
        formation["ratings"] = formation.ratings.length;
        delete formation.rate;
        formation["rate_total"] = Math.round(result);
      })

      ctx.send(formations);
    },

    async getExist(ctx) {
      const id = ctx.params.id
      const formation = await strapi.db
        .query("api::formation.formation")
        .findOne({
          select: ["id", "publishedAt"],
          where: { id: id },
        });
      if (formation && formation.publishedAt != null) {
        ctx.send(true);
      } else {
        ctx.send(false);
      }
      
    },

    
    async getData(ctx) {
      const slug = ctx.params.slug
      let decoded = (ctx.request.header && ctx.request.header.authorization) ? jwt_decode(ctx.request.header.authorization) : null;
      const userId = (decoded) ? decoded.id : null;
      let formations;
      if(userId){
        formations = await strapi.entityService.findMany('api::formation.formation', {
          filters : { 
               slug : slug
          },
          populate: {
            Modules : {
              populate : {
                module : true
              }
            },
              financeurs : {
                populate : { 
                  Logo : {
                    fields: ["url"]
                  },
                }
              },
              formations_category : true,
            image: {
              fields: ["url"]
            },
            image_cover: {
              fields: ["url"]
            },
            ratings : {
              populate : {
                user : {
                  fields : ["id","username","email","Profession","biography","phoneNumber","twitter","facebook","instagram","linkedin"],
                  populate : { 
                    avatar: {
                      fields: ["url"]
                    },
                  }
                     }
              }
            }, //add limit
            sessions : true,
            video_media : true,
            certifications : {
              populate : { 
                Logo : {
                  fields: ["url"]
                },
              }
            },
            enseignant : {
              populate : {
                avatar: {
                  fields: ["url"]
                },
              }
            }
          },
          limit: 1
        });
      }else{
        formations = await strapi.entityService.findMany('api::formation.formation', {
          filters : { 
            showFormation : true,
            slug : slug,
            formations_category : { 
              showCategory : {
                $eq : true
              }
            }
          },
          populate: {
            Modules : {
              populate : {
                module : true
              }
            },
              financeurs : {
                populate : { 
                  Logo : {
                    fields: ["url"]
                  },
                }
              },
              formations_category : true,
            image: {
              fields: ["url"]
            },
            image_cover: {
              fields: ["url"]
            },
            ratings : {
              populate : {
                user : {
                  fields : ["id","username","email","Profession","biography","phoneNumber","twitter","facebook","instagram","linkedin"],

                  populate : { 
                    avatar: {
                      fields: ["url"]
                    },
                  }
                     }
              }
            }, //add limit
            sessions : true,
            video_media : true,
            certifications : {
              populate : { 
                Logo : {
                  fields: ["url"]
                },
              }
            },
            enseignant : {
              populate : {
                avatar: {
                  fields: ["url"]
                },
              }
            }
          },
          limit: 1
        });
      }

     
      if(formations.length > 0){
        (formations[0].showEnseignant) ?  null : delete formations[0].enseignant;
      }
      ctx.send(formations)

     
      
    },


  })
);
