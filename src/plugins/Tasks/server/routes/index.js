module.exports = [
  {
    method: "GET",
    path: "/content-types",
    handler: "tasks.findContentTypes",
    config: {
      auth: false,
      policies: [],
    },
  },
];
