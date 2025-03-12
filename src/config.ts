import dotenv from "dotenv"
dotenv.config()

const config = {

 db_name :process.env.DB_NAME as string, 
 db_username :process.env.DB_USERNAME as string,
 db_password :process.env.DB_PASSWORD as string,
 port :process.env.PORT as string,
 secret_key :process.env.SECRET_KEY as string,
}

export default config;