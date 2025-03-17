import dotenv from "dotenv";
dotenv.config();

const config = {
  db_name: process.env.DB_NAME as string,
  db_username: process.env.DB_USERNAME as string,
  db_password: process.env.DB_PASSWORD as string,
  port: process.env.PORT as string,
  secret_key: process.env.SECRET_KEY as string,
  email_host: process.env.EMAIL_HOST as string,
  email_port: Number(process.env.EMAIL_PORT as string),
  email_auth_user: process.env.EMAIL_AUTH_USER as string,
  email_auth_pass: process.env.EMAIL_AUTH_PASS as string,
};

export default config;
