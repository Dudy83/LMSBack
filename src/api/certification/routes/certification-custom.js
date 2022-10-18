'use strict';




module.exports = {
    routes: [
        {
            "method": "POST",
            "path": "/certification/send",
            "handler": "certification.SendCertif",
            "config": {
              "policies": []
            }
          },
        ]
    }

    