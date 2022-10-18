'use strict';

/**
 * rating custom router.
 */


module.exports = {
    routes: [
        {
            "method": "GET",
            "path": "/ratings/count",
            "handler": "rating.getCount",
            "config": {
              "policies": []
            }
          },
          {
            "method": "GET",
            "path": "/ratings/forcoursedetail/:id",
            "handler": "rating.forcoursedetail",
            "config": {
              "policies": []
            }
          },
          {
            "method": "GET",
            "path": "/ratings/communityavis/:slug",
            "handler": "rating.CommunityAvis",
            "config": {
              "policies": []
            }
          },
          {
            "method": "GET",
            "path": "/ratings/getuserrate/:id_formation",
            "handler": "rating.GetUserRate",
            "config": {
              "policies": []
            }
          },
          {
            "method": "PUT",
            "path": "/ratings/MyRating/:id_rating",
            "handler": "rating.MyRating",
            "config": {
              "policies": []
            }
          },
          // {
          //   "method": "GET",
          //   "path": "/ratings/userAlreadyRated/:id",
          //   "handler": "rating.userAlreadyRated",
          //   "config": {
          //     "policies": []
          //   }
          // }
    ]
}
