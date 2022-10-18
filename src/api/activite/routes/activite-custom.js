'use strict';

/**
 * activite custom router.
 */


module.exports = {
    routes: [
        {
            "method": "GET",
            "path": "/getActiviteContent/:id_session/:id_formation/:id_activity",
            "handler": "activite.getActiviteContent",
            "config": {
              "policies": []
            }
          },

          
      
    ]
}
