'use strict';

/**
 *  activites-log-store controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const jwt_decode = require("jwt-decode");
const dayjs = require('dayjs');

const { sanitizeEntity } = require('@strapi/utils');
module.exports = createCoreController('api::activites-log-store.activites-log-store',
    ({ strapi }) => ({

        async getLatestLogs(ctx) {
            let decoded = jwt_decode(ctx.request.header.authorization);
            const userId = decoded.id;
            const id_session = ctx.params.id_session;
            let latestlog = await strapi.entityService.findMany('api::activites-log-store.activites-log-store', {
                filters: {
                    session: id_session,
                    users_permissions_user: userId,
                },
                populate: {
                    logs: {
                        fields: ['id', 'pourcentage', 'time', 'date_created', 'totalActivity', 'totalDone'],
                        sort: { id: 'DESC' },
                        populate: {
                            activites: {
                                fields: ['id'],
                            },
                            module: {
                                fields: ['id']
                            }
                        }
                    },
                    users_permissions_user: {
                        fields: ['id'],
                    },
                    session: {
                        fields: ['id'],
                    }
                },
                sort: { id: 'DESC' },
                limit: 1,
            });

            if (latestlog[0]) {
                let logs = latestlog[0].logs[0]
                latestlog[0].logs = logs;
                ctx.send(latestlog[0]);
            } else {
                ctx.send(null)

            }

        },
        async UpdateLog(ctx) {
            let decoded = jwt_decode(ctx.request.header.authorization);
            const userId = decoded.id;
            dayjs.locale('fr')
            const date_tz = dayjs().format()
            let data = { ...ctx.request.body.data };
            data.users_permissions_user = userId
            data.updatedAt = date_tz
            let id = ctx.params.id;
            const update = await strapi.entityService.update("api::activites-log-store.activites-log-store", id, { data: { ...data } });


            ctx.send(update);
        },

        async PostLogs(ctx) {
            let decoded = jwt_decode(ctx.request.header.authorization);
            const userId = decoded.id;
            let data = { ...ctx.request.body.data };
            data.users_permissions_user = userId
            const post = await strapi.entityService.create("api::activites-log-store.activites-log-store", { data: { ...data } })

            ctx.send(post);


        },

        async RapportSession(ctx) {
            let decoded = jwt_decode(ctx.request.header.authorization);
            const userId = decoded.id;
            const id_session = ctx.params.id_session;
            let latestlog = await strapi.entityService.findMany('api::activites-log-store.activites-log-store', {
                filters: {
                    session: id_session,
                    users_permissions_user: userId,
                },
                populate: {
                    logs: {
                        fields: ['id', 'pourcentage', 'time', 'date_created', 'totalActivity', 'totalDone'],
                        sort: { id: 'DESC' },
                    },

                },
                sort: { id: 'ASC' },

            });
            let final_logs = [];
            var index = 1;
            dayjs.locale('fr')

          
            latestlog.forEach((session)=>{
                if(session.logs && session.logs.length > 0){
              
                const diff = (session.logs.length > 1) ? session.logs[0].time - session.logs[session.logs.length - 1].time : session.logs[0].time;
                const date1 =  dayjs(session.updatedAt);
                const date2 = dayjs(session.createdAt);
                if(date1.diff(date2) > 0){

              
                let sessioninfo = {
                    id: index,
                    date_start :   dayjs(session.createdAt).format('DD/MM/YYYY HH:mm:ss'),
                    date_finish : dayjs(session.updatedAt).format('DD/MM/YYYY HH:mm:ss'),
                    pourcentage : session.logs[0].pourcentage,
                    time : diff > 0 ? diff : 0
                }
                final_logs.push(sessioninfo);
               index++;

            }
        }
            })
            ctx.send(final_logs)
        },

        async StatsSession(ctx) {
            let decoded = jwt_decode(ctx.request.header.authorization);
            const userId = decoded.id;
            const id_session = ctx.params.id_session;
            let data = { ...ctx.request.body.data };
            const month = data.months;
            const mont_actual = data.months[data.months.length - 1];
            const week = data.weeks;
            let latestlog = await strapi.entityService.findMany('api::activites-log-store.activites-log-store', {
                filters: {
                    session: id_session,
                    users_permissions_user: userId,
                },
                populate: {
                    logs: {
                        fields: ['id', 'pourcentage', 'time', 'date_created', 'totalActivity', 'totalDone'],
                        sort: { id: 'DESC' },
                    },

                },
                sort: { id: 'ASC' },

            });
            var index = 1;
            dayjs.locale('fr')
            let sessionsInfos = {
                months : [],
                weeks : []
            }
            let sessionsInfosFinal = {
                months : {},
                weeks : {},
            }
          
            latestlog.forEach((session)=>{
                if(session.logs && session.logs.length > 0){
              
                const diff = (session.logs.length > 1) ? session.logs[0].time - session.logs[session.logs.length - 1].time : session.logs[0].time;
                const date1 =  dayjs(session.updatedAt);
                const date2 = dayjs(session.createdAt);
                if(date1.diff(date2) > 0 && (parseInt(dayjs(date1).format("YYYY"))  == dayjs().year() ||  parseInt(dayjs(date2).format("YYYY"))  == dayjs().year())){
                    let sessioninfo = { 
                        id: index,
                      date_start :   session.createdAt,
                      date_finish : session.updatedAt,
                      pourcentage : session.logs[0].pourcentage,
                      time : diff > 0 ? diff : 0 
                  }
                    if(week.find((el)=> el == parseInt(dayjs(date1).format("DD"))) &&  parseInt(dayjs(date1).format("MM")) == mont_actual || (week.find((el)=> el == parseInt(dayjs(date2).format("DD"))) && parseInt(dayjs(date1).format("MM")) == mont_actual) ){
                       
                        sessionsInfos.weeks.push(sessioninfo);
                    }  
                    
                    sessionsInfos.months.push(sessioninfo);
               index++;

            }
        }
            })
            let TraitementFinal = {
                months : [],
                weeks : [],
                time_week : 0,
                time_month : 0

            }

            if(sessionsInfos.weeks.length > 0){
                for(var i=0; i < sessionsInfos.weeks.length; i++){
                    
                    const day = parseInt(dayjs(sessionsInfos.weeks[i].date_finish).format("DD"));
                    const day1 = (sessionsInfos.weeks[i + 1]) ? parseInt(dayjs(sessionsInfos.weeks[i + 1].date_finish).format("DD")) : null;     
                    TraitementFinal.time_week += parseInt(sessionsInfos.weeks[i].time);       
                    if(day == day1){
                       continue;
                    }else{
                        sessionsInfosFinal.weeks[day] ={  pourcent : sessionsInfos.weeks[i].pourcentage };
                    }

                }
            }
            if(sessionsInfos.months.length > 0){
                for(var i=0; i < sessionsInfos.months.length; i++){
                    const month = parseInt(dayjs(sessionsInfos.months[i].date_finish).format("MM"));
                    const month1 = (sessionsInfos.months[i + 1]) ? parseInt(dayjs(sessionsInfos.months[i + 1].date_finish).format("MM")) : null;
                    TraitementFinal.time_month += parseInt(sessionsInfos.months[i].time);       
                    if(month == month1){
                    
                        continue;     
                }else{
                    sessionsInfosFinal.months[month] = { pourcent :sessionsInfos.months[i].pourcentage };
                }

                }
            }

    
            if(week.length != Object.keys(sessionsInfosFinal.weeks).length){
                let find = 0;
                for(var i=0; i < week.length; i++){
                
                  if(!sessionsInfosFinal.weeks[week[i]]){
            
                 TraitementFinal.weeks.push(find) ;

                                 }else{
                        find = sessionsInfosFinal.weeks[week[i]].pourcent;
                    TraitementFinal.weeks.push(sessionsInfosFinal.weeks[week[i]].pourcent)

                  }
            
                }
            }

            if(month.length != Object.keys(sessionsInfosFinal.months).length){
                let find = 0;

                for(var i=0; i < month.length; i++){

                    if(!sessionsInfosFinal.months[month[i]]){
                 
                        TraitementFinal.months.push(find);

                        
                       
                      }else{
                        find = sessionsInfosFinal.months[month[i]].pourcent;
                        TraitementFinal.months.push(sessionsInfosFinal.months[month[i]].pourcent)
    
                      }

            
                }
            }
            ctx.send(TraitementFinal)
        },

        async SessionInfo(ctx) {
            let decoded = jwt_decode(ctx.request.header.authorization);
            const userId = decoded.id;
            let data = ctx.request.body.data;

            let final = await strapi.entityService.findMany("api::session.session", {
                filters: {
                    id: data,
                    users_permissions_users: userId,
                },
                populate: {
                    formation: {
                        fields: ['id', 'title', 'slug'],
                        populate: {
                            formations_category: {
                                fields: ['id', 'title', 'icon', 'slug']
                            },
                            certifications : {
                                fields : ["titre","Description","idTemplate"],
                                populate : {
                                    Logo : 
                                    {
                                        fields : ["url"]
                                    }
                                }
                            }
                        }

                    },

                },

            });
            let sessions_info = {}
            final.forEach((el) => { sessions_info[el.id] = el })
            ctx.send(sessions_info);
        }

    })

);
