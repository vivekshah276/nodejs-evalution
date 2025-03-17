import { Router } from "express";
import { forgotPassword, NewPassword, PostLogin,PostSignup, updateProfile } from "../controller/auth";
import { body, validationResult } from "express-validator";
import isAuth from "../middleware/is-auth";

const router = Router();

router.post(
  "/signup",
  [
    body("email")
      
      .isEmail()
      .withMessage("Invalid email format")
      .trim(),
    body("phone")
      .matches(/^[789]\d{9}$/)
      .withMessage("Enter Valid phone number.")

      .trim(),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be 5 characters"),
    body().custom((value, { req }) => {
      if (!req.body.email && !req.body.phone) {
        throw new Error("Either email or phone is required");
      }
      return true;
    }),
  ],
  PostSignup
);

router.post("/login",[
    body('email').optional().isEmail().withMessage("Invalid email Format").trim(),
    body('phone').optional().isNumeric().withMessage("Enter Number").trim(),
    body().custom((_,{req})=>{
        if(!req.body.email && !req.body.phone){
            throw new Error("Enter email or Phone Number");
        }
        return true;
    }),

    body('password').isLength({min:5}).withMessage("Password must be 5 characters")

],PostLogin)

router.post("/forgotpassword",
  [
    body('email').optional().isEmail().withMessage("Invalid email Format").trim(),
  ],forgotPassword)

router.put("/newpassword",NewPassword);

router.patch("/updateprofile", [
  body("email")
    
    .isEmail()
    .withMessage("Invalid email format")
    .trim(),
  body("phone")
    .matches(/^[789]\d{9}$/)
    .withMessage("Enter Valid phone number.")

    .trim(),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be 5 characters"),
    body().custom((value, { req }) => {
      if (!req.body.email && !req.body.phone) {
        throw new Error("Either email or phone is required");
      }
      return true;
    }),
  ],isAuth,updateProfile)

export default router;
