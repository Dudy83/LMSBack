'use strict';
const jwt_decode = require("jwt-decode");

/**
 *  activites-log controller
 */
const dayjs = require('dayjs');
const { copyWithin } = require('../../../../config/middlewares');

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::activites-log.activites-log',
  ({ strapi }) => ({
    async FindLog(ctx) {
      let decoded = jwt_decode(ctx.request.header.authorization);
      const userId = decoded.id;
      const id_activity = ctx.params.id_activity;
      const id_session = ctx.params.id_session;
      const id_module = ctx.params.id_module;
      const activityLog = await strapi.db
        .query("api::activites-log.activites-log")
        .findOne({
          where: { activite: id_activity, module: id_module, session: id_session, users_permissions_user: userId },
        });
      if (activityLog != null) {
        ctx.send(activityLog);
      } else {
        ctx.send(false);
      }


    },


    async LatestLogActivity(ctx) {

      let decoded = jwt_decode(ctx.request.header.authorization);
      const userId = decoded.id;
	console.log("user id ", userId);
      const id_session = ctx.params.id_session;
      let activitylog2 = await strapi.entityService.findMany('api::activites-log.activites-log', {
        filters: {
          session: id_session, users_permissions_user: userId,isActive: { $eq: true} 
        },
        populate: {
          activite: true,
          module: true,
        },
        fields: ["id", "isActive"],
        sort: { id: 'DESC' },
        limit: 1
      });
      let activityLog = activitylog2[0];

	console.log("activite log LastestMpgActivity", activityLog);

      if (activityLog) {
        ctx.send(activityLog);
      }
      else {
        ctx.send(false)
      }
    },
    async updateLog(ctx) {
      let decoded = jwt_decode(ctx.request.header.authorization);
      const userId = decoded.id;
      dayjs.locale('fr')
      const date_tz = dayjs().format()
      let data = { ...ctx.request.body.data };
      data.users_permissions_user = userId
      data.updatedAt = date_tz
      let id = ctx.params.id;
      const activityLog = await strapi.entityService.update("api::activites-log.activites-log", id, { data: { ...data } });
      ctx.send(activityLog);

    },
    async CreatLogActivity(ctx) {
      let decoded = jwt_decode(ctx.request.header.authorization);
      const userId = decoded.id;
      dayjs.locale('fr')
      const date_tz = dayjs().format()
      let data = { ...ctx.request.body.data };
      data.users_permissions_user = userId
      data.publishedAt = date_tz
      const post = await strapi.entityService.create("api::activites-log.activites-log", { data: { ...data } })
      ctx.send(post);

    },

    async LatestCourse(ctx) {
      let decoded = jwt_decode(ctx.request.header.authorization);
      const userId = decoded.id;

      let sessions = await strapi.entityService.findMany('api::session.session', {
        filters: {
          users_permissions_users: userId
        },
        fields: ["id", "date_start", "date_finish"],
        sort: { date_finish: 'DESC' },

      });

      if (sessions && sessions.length > 0) {

        dayjs.locale('fr')
        const date_now = dayjs(new Date()).unix() * 1000;
        let id_session = {
          SessionClose: [],
          SessionOpen: []
        };
        var id_sessions = []
        sessions.forEach((session) => {
          let dateEnd = new Date(session.date_finish).getTime();
          let dateStart = new Date(session.date_start).getTime();
          id_sessions.push(session.id)
          if (dateEnd > date_now) {
            if (dateStart > date_now) {
              id_session.SessionClose.push(session.id)

            } else {
              id_session.SessionOpen.push(session.id)

            }
          } else {
            id_session.SessionClose.push(session.id)
          }

        })

        let activityLog = await strapi.entityService.findMany('api::activites-log.activites-log', {
          filters: {
            users_permissions_user: userId, session: id_session.SessionOpen
          },
          fields: ["id", "time", "done"],
          populate: {
            session: {
              fields: ["id"],
              populate: {
                formation: {
                  fields: ["id"],
                  populate: {
                    Modules: {
                      fields: ["id"],
                      populate: {
                        module: {
                          fields: ["id"],
                          populate: {
                            Activites: {
                              fields: ["id"],

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
          sort: { id: 'DESC' },

        });
        if (activityLog && activityLog.length > 0) {

          let final = await strapi.db
            .query("api::activites-log.activites-log")
            .findOne({
              populate: ["session", "session.formation", "session.formation.image", "session.formation.formations_category"],
              where: { id: activityLog[0].id },
            });

          let session_final = final.session.id;
          let time_total = 0;
          let total_courses_finish = 0;
          let activitieslog = {}
          id_sessions.forEach((id_session) => {

            const filter_session = activityLog.filter((el) => el.session.id == id_session);
            let total_course_time = 0;
            let total_done = 0;
            let total_activities = 0;
            (filter_session.length > 0) ? filter_session[0].session.formation.Modules.forEach((m) => {
              if (m.module && m.module.Activites && Array.isArray(m.module.Activites))
                total_activities += m.module.Activites.length;
            }) : null;
            filter_session.forEach((filter_el) => {
              if (filter_el) {
                time_total += filter_el.time
                total_course_time += filter_el.time;
                (filter_el.done) ? total_done += 1 : null;

              }
            })
            let addto = {
              total_course_time: total_course_time,
              total_done: total_done,
              total_activities: total_activities,
            }
            if (total_activities > 0 && total_done == total_activities) {
              addto.finish = true;
              total_courses_finish += 1;
            }
            activitieslog[id_session] = addto
          })


          let dashboard = {
            numberActivities: activityLog.length,
            timeActivities: time_total,
            totalCoursesFinish: total_courses_finish,
            course: {
              totalTimeCourse: activitieslog[session_final].total_course_time,
              total_done: activitieslog[session_final].total_done,
              total_activities: activitieslog[session_final].total_activities
            }

          };



          if (final && final.content && final.content[0] != undefined && final.content[0].lienUrl != undefined) {
            final.content = final.content[0].lienUrl;
            ctx.send({ sessionProgress: final, dashboard: dashboard, activityLog: activitieslog });

          } else {
            delete final.content;
            ctx.send({ sessionProgress: final, dashboard: dashboard, activityLog: activitieslog });
          }
        } else {

          let addto = {
            total_course_time: 0,
            total_done: 0,
            total_activities: 0,
          }
          let activitieslog = {}

          if (id_session.SessionOpen.length > 0) {
            let sessionOpen = await strapi.db
              .query("api::session.session")
              .findOne({
                populate: ["formation", "formation.formations_category", "formation.image"],
                where: { id: id_session.SessionOpen[0] },
              });
            activitieslog[id_session.SessionOpen[0]] = addto
            ctx.send({ sessionStart: sessionOpen, activityLog: activitieslog })
          } else {
            ctx.send({ sessionAny: true });
          }

        }
      } else {
        ctx.send({ sessionAny: true });
      }





    },


  })
);
