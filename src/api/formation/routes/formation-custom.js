'use strict';

/**
 * formation custom router.
 */


module.exports = {
    routes: [
 
      {
        "method": "GET",
        "path": "/formations/getdata/:slug",
        "handler": "formation.getData",
        "config": {
          "policies": []
        }
      },
        {
            "method": "GET",
            "path": "/formations/count",
            "handler": "formation.getCount",
            "config": {
              "policies": []
            }
          },
        {
            "method": "GET",
            "path": "/formationsByCategPreview/:id",
            "handler": "formation.formationsByCategPreview",
            "config": {
              "policies": []
            }
          },
          {
            "method": "GET",
            "path": "/getProgramme/:id",
            "handler": "formation.getProgramme",
            "config": {
              "policies": []
            }
          },
          {
            "method": "GET",
            "path": "/getProgrammeSuivi/:id_formation/:id_session",
            "handler": "formation.getProgrammeSuivi",
            "config": {
              "policies": []
            }
          },
          {
            "method": "GET",
            "path": "/getFormationCards/:limit",
            "handler": "formation.getFormationCards",
            "config": {
              "policies": []
            }
          },
          {
            "method": "GET",
            "path": "/getSuggestion/:id",
            "handler": "formation.getSuggestion",
            "config": {
              "policies": []
            }
          },
          {
            "method": "GET",
            "path": "/formation/exist/:id",
            "handler": "formation.getExist",
            "config": {
              "policies": []
            }
          },
          {
            "method": "GET",
            "path": "/program/exists/:id",
            "handler": "formation.getProgrammeExist",
            "config": {
              "policies": []
            }
          },
          {
            "method": "GET",
            "path": "/community/formation/:slug",
            "handler": "formation.getCommunityFormationPreview",
            "config": {
              "policies": []
            }
          }
    ]
}
