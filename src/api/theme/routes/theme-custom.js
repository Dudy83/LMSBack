"use strict";

/**
 * formation custom router.
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/theme/init",
      handler: "theme.SetTheme",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/theme/colors",
      handler: "theme.getColors",
      config: {
        policies: [],
      },
    },
  ],
};
