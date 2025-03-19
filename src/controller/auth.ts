import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import config from "../config.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Op } from "sequelize";

const transporter = nodemailer.createTransport({
  host: config.email_host,
  port: config.email_port,
  auth: {
    user: config.email_auth_user,
    pass: config.email_auth_pass,
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

//login with email or phone
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
    }

    next(error);
  }
};

//forgot password via email
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
  try {
    const user = await User.findOne({
      where: {
        resetToken: passwordToken,
        resetTokenExpiration: {
          [Op.gt]: new Date(),
        },
      },
    });
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

//update the user profile
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user.id;
  const { name, email, phone, password } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error("no user found") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    user.name = name || user?.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
    }
    user?.save();
    res.status(200).json({ success: true, user: user });
    return;
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
