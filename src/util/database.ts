import { Sequelize } from "sequelize";
import config from "../config.js";

console.log("db",config.db_name)
const sequelize = new Sequelize(config.db_name, config.db_username , config.db_password, {
  dialect: "mysql",
  host: "localhost",
});

export default sequelize;


