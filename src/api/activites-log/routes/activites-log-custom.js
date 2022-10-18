'use strict';

/**
 * formation custom router.
 */


module.exports = {
    routes: [
        {
            "method": "GET",
            "path": "/activites-logs/find/:id_session/:id_module/:id_activity",
            "handler": "activites-log.FindLog",
            "config": {
              "policies": []
            }
          },

     {
            "method": "GET",
            "path": "/activites-logs/latest/:id_session",
            "handler": "activites-log.LatestLogActivity",
            "config": {
              "policies": []
            }
          },
          {
            "method": "PUT",
            "path": "/activites-logs/update/:id",
            "handler": "activites-log.updateLog",
            "config": {
              "policies": []
            }
          },
          {
            "method": "POST",
            "path": "/activites-logs/create",
            "handler": "activites-log.CreatLogActivity",
            "config": {
              "policies": []
            }
          },

       
     {
      "method": "GET",
      "path": "/activites-logs/course",
      "handler": "activites-log.LatestCourse",
      "config": {
        "policies": []
      }
    },

    ]
}
