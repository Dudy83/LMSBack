'use strict';

/**
 * formation custom router.
 */


module.exports = {
    routes: [
        {
            "method": "GET",
            "path": "/faq/home",
            "handler": "faq.faqHome",
            "config": {
              "policies": []
            }
          },
    
        
          
    ]
}
