'use strict';

/**
 * formation custom router.
 */


module.exports = {
    routes: [
        {
            "method": "GET",
            "path": "/activites-log-store/findLatest/:id_session",
            "handler": "activites-log-store.getLatestLogs",
            "config": {
              "policies": []
            }
          },
     
          {
            "method": "PUT",
            "path": "/activites-log-store/updateLogin/:id",
            "handler": "activites-log-store.UpdateLog",
            "config": {
              "policies": []
            }
          },
     
          {
            "method": "POST",
            "path": "/activites-log-store/post",
            "handler": "activites-log-store.PostLogs",
            "config": {
              "policies": []
            }
          },
          {
            "method": "GET",
            "path": "/activites-log-store/rapport/:id_session",
            "handler": "activites-log-store.RapportSession",
            "config": {
              "policies": []
            }
          },
          {
            "method": "PUT",
            "path": "/activites-log-store/stats/:id_session",
            "handler": "activites-log-store.StatsSession",
            "config": {
              "policies": []
            }
          },

          {
            "method": "POST",
            "path": "/activites-log-store/sessioninfo/recup",
            "handler": "activites-log-store.SessionInfo",
            "config": {
              "policies": []
            }
          },
       
       
        
    ]
}
