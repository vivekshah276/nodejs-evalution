import { Sequelize } from "sequelize";
import config from "../config.js";
console.log(config.db_name)
console.log(config.db_password)
console.log(config.db_username)

const sequelize = new Sequelize(config.db_name, config.db_username , config.db_password, {
  dialect: "mysql",
  host: "localhost",
});

export default sequelize;


