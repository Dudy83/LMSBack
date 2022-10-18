'use strict';



module.exports = {
    routes: [
        {
            "method": "POST",
            "path": "/newsletter/exist",
            "handler": "newsletter.Subscribe",
            "config": {
              "policies": []
            }
          },

          {
            "method": "POST",
            "path": "/newsletter/updateauthorize",
            "handler": "newsletter.Update",
            "config": {
              "policies": []
            }
          },
          {
            "method": "POST",
            "path": "/newsletter/register",
            "handler": "newsletter.Exist",
            "config": {
              "policies": []
            }
          },

    ]
}
