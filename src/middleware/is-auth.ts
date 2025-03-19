import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config.js";

interface CustomError extends Error {
  statusCode?: number;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  try {
    if (!authHeader) {
      const error: CustomError = new Error("Not Authorized");
      error.statusCode = 403;
      return next(error);
    }

    const token = await authHeader.split(" ")[1];
    let decoded = jwt.verify(token, config.secret_key);
    if (!decoded) {
      const error: CustomError = new Error("Not Valid token");
      error.statusCode = 401;
      throw error;
    }
    (req as any).user = decoded;
    next();
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export default isAuth;
