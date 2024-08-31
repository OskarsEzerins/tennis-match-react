require("dotenv").config();

module.exports = {
  development: {
    username: process.env.db_username,
    password: process.env.db_password,
    database: "express_tennis_development",
    host: "localhost",
    dialect: "postgres"
  },
  test: {
    username: process.env.db_username,
    password: process.env.db_password,
    database: "express_tennis_test",
    host: "localhost",
    dialect: "postgres",
    logging: false
  },
  production: {
    // TODO: investigate
    use_env_variable: "JAWSDB_URL",
    dialect: "postgres"
  }
};
