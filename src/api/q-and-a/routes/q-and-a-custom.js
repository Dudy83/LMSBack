"use strict";

/**
 * q-and-a custom router.
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/qa/getbyformation/:id/:slug",
      handler: "q-and-a.getByFormation",
      config: {
        policies: [],
      },
    },
    {
        method: "GET",
        path: "/qa/getforumbyformation/:slug",
        handler: "q-and-a.getForumByFormation",
        config: {
          policies: [],
        },
      },
  ],
};
