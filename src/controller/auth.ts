import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import config from "../config.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Op } from "sequelize";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "earl.hirthe@ethereal.email",
    pass: "kSVP3TR4Hmk2CY2FfR",
  },
});

interface CustomError extends Error {
  statusCode: number;
}

//signup user
export const PostSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const email: string = req.body.email;
  const name: string = req.body.name;
  const phone: number = req.body.phone;
  const password: string = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await User.create({
      email,
      phone,
      name,
      password: hashedPassword,
    });
    res.status(201).json({ success: true, user: user });
    return;
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};


//login
export const PostLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;

  try {
    const user = await User.findOne({
      where: { ...(email ? { email } : { phone }) },
    });
    if (!user) {
      const error = new Error("User not found") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    //console.log("ksjgjk")
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      res.status(400).json({ message: "Password not matched" });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        ...(email ? { email: user.email } : { phone: user.phone }),
      },
      config.secret_key,
      { expiresIn: "1h" }
    );
    res.status(200).json({ success: true, token: token });
    return;
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
      console.log(error);
    }

    next(error);
  }
};

//forgot password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const email = req.body.email;
  try {
    crypto.randomBytes(32, async (error, buffer) => {
      if (error) {
        res.status(400).json({ message: "error!" });
      }
      const token = buffer.toString("hex");
      const user = await User.findOne({ where: { email } });
      if (!user) {
        const error = new Error("User not found!") as CustomError;
        error.statusCode = 404;
        throw error;
      }
      user.resetToken = token;
      user.resetTokenExpiration = new Date(Date.now() + 3600000);
      user.save();

      const sendEmail = await transporter.sendMail({
        from: "earl.hirthe@ethereal.email",
        to: req.body.email,
        subject: "Reset Password link",
        html: `<h1>You requested a password reset</h1>
        <p><a href="https:localhost:3000/reset/${token}">to set a new password</a></p>
        `,
      });
      res.status(200).json({ success: true });
      return;
    });
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//set new password
export const NewPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const newPassword = req.body.password;
  const passwordToken = req.body.token;
  console.log("token", passwordToken);
  try {
    const user = await User.findOne({
      where: {
        resetToken: passwordToken,
        resetTokenExpiration: {
          [Op.gt]: new Date(),
        },
      },
    });
    console.log("user", user);
    if (!user) {
      const error = new Error("User not found!!") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    user.save();
    res.status(200).json({ success: true, user: user });
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
