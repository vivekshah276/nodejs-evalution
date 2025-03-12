import express from "express";
import { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import sequelize from "./util/database";
import authRoutes from "./routes/auth.js"
import dotenv from "dotenv"

dotenv.config()

const app = express();

app.use(bodyParser.json())

app.use(authRoutes)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: err.message });
});

app.use((err:any, req:Request, res:Response, next:NextFunction)=>{
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({message: "Error in internal server"})
})

const startServer = async()=>{
    try{
        await sequelize.sync()
        console.log("Database Connected")
        app.listen(process.env.PORT,()=>{
            console.log("Server is listening")
        })
    }
    catch(err){
        console.log(err)
    }
}
startServer();