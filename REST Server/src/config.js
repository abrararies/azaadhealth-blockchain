/* eslint-disable no-unused-vars */
import path from "path";
import merge from "lodash/merge";

/* istanbul ignore next */
const requireProcessEnv = name => {
  if (!process.env[name]) {
    throw new Error("You must set the " + name + " environment variable");
  }
  return process.env[name];
};

/* istanbul ignore next */
if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv-safe");
  dotenv.load({
    path: path.join(__dirname, "../.env"),
    sample: path.join(__dirname, "../.env.example")
  });
}

const config = {
  all: {
    env: process.env.NODE_ENV || "development",
    root: path.join(__dirname, ".."),
    port: process.env.PORT || 9000,
    ip: process.env.IP || "0.0.0.0",
    apiRoot: process.env.API_ROOT || "",
    defaultEmail: "no-reply@azaad-insurance.com",
    sendgridKey: requireProcessEnv("SENDGRID_KEY"),
    masterKey: requireProcessEnv("MASTER_KEY"),
    jwtSecret: requireProcessEnv("JWT_SECRET"),
    COMPOSER_REST_SERVER: requireProcessEnv("COMPOSER_REST_SERVER"),
    AWS_ACCESS_KEY_ID: requireProcessEnv("AWS_ACCESS_KEY_ID"),
    AWS_SECRET_ACCESS_KEY: requireProcessEnv("AWS_SECRET_ACCESS_KEY"),
    AWS_REGION: requireProcessEnv("AWS_REGION"),
    DEFAULT_BUCKET: requireProcessEnv("DEFAULT_BUCKET"),
    mongo: {
      options: {
        db: {
          safe: true
        }
      }
    }
  },
  test: {},
  development: {
    mongo: {
      uri:
        "mongodb://uid:pwd@host:post/db-name",
      options: {
        debug: true
      }
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 9000,
    mongo: {
      uri:
        process.env.MONGODB_URI ||
        "mongodb://uid:pwd@host:post/db-name"
    }
  }
};
module.exports = merge(config.all, config[config.all.env]);
export default module.exports;
