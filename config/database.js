// const fs = require('fs');



// module.exports = ({ env }) => ({
//   connection: {
//     client: "postgres",
//     connection: {
//       host: env("DATABASE_HOST", "lcmsbdd.cjrjkkceomqz.eu-west-2.rds.amazonaws.com"),
//       port: env.int("DATABASE_PORT", 5432),
//       database: env("DATABASE_NAME", "lcms"),
//       user: env("DATABASE_USERNAME", "postgres"),
//       password: env("DATABASE_PASSWORD", "Pkolpkol13!"),

//     },
//     useNullAsDefault: true, 
//   },
// });


module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "127.0.0.1"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "LMS"),
      user: env("DATABASE_USERNAME", "manne"),
      password: env("DATABASE_PASSWORD", "root"),

    },
    useNullAsDefault: true, 
  },
});
