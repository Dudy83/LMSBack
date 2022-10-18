'use strict';

/**
 * formation custom router.
 */


module.exports = {
    routes: [
        
        {
          "method": "GET",
          "path": "/session/community",
          "handler": "session.Community",
          "config": {
            "policies": []
          }
        }
    ]
}
