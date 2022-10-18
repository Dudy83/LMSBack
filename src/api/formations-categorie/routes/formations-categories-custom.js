'use strict';

/**
 * formations-categories custom router.
 */


module.exports = {
    routes: [
        {
            "method": "GET",
            "path": "/formations-categories/count",
            "handler": "formations-categorie.getCount",
            "config": {
              "policies": []
            }
          },
        {
            "method": "GET",
            "path": "/getCategAndCount",
            "handler": "formations-categorie.getCategAndCount",
            "config": {
              "policies": []
            }
          },
          {
            "method": "GET",
            "path": "/getCategs",
            "handler": "formations-categorie.getCategs",
            "config": {
              "policies": []
            }
          },
    ]
}
