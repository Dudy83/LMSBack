'use strict';

/**
 * order custom router.
 */


module.exports = {
    routes: [
        {
            "method": "GET",
            "path": "/orders/count",
            "handler": "order.getCount",
            "config": {
              "policies": []
            }
          },
          {
            "method": "GET",
            "path": "/orders/user",
            "handler": "order.GetOrdersByUser",
            "config": {
              "policies": []
            }
          },
          {
            "method": "POST",
            "path": "/orders/create",
            "handler": "order.CreateOrder",
            "config": {
              "policies": []
            }
          },
    ]
}
