module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '9c2a7d8101754f0c9b54bad6de447916'),
  },
});
