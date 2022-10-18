'use strict';

/**
 * rating custom router.
 */


module.exports = {
    routes: [
        {
            "method": "GET",
            "path": "/accueil/order",
            "handler": "accueil.Order",
            "config": {
              "policies": []
            }
        },
     
    ]
}