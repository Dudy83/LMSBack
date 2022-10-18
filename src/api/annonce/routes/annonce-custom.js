'use strict';

/**
 * formation custom router.
 */


module.exports = {
    routes: [
        
        {
          "method": "GET",
          "path": "/annonces/formation/:slug",
          "handler": "annonce.AnnonceCommunity",
          "config": {
            "policies": []
          }
        }
    ]
}
