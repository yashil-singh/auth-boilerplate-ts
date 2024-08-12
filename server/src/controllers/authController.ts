import {
  generateRandomString,
  verifyPassword,
} from "./../utils/authentication";
import { Request } from "express";
import User from "../models/User";
import {
  generateRandomNumbers,
  hashPassword,
  setCookieToken,
} from "../utils/authentication";
import { CustomResponse } from "../middlewares/responseMiddleware";
import sendMail from "../utils/mailer";
import {
  generatePasswordResetMailTemplate,
  generatePasswordResetSuccessMailTemplate,
  generateVerificationMailTemplate,
  generateWelcomeMailTemplate,
} from "../utils/mailTemplates";
import { CustomRequest } from "../middlewares/strictVerification";

export const signup = async (req: Request, res: CustomResponse) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.error({
        message: "Name is required.",
      });
    }

    if (!email) {
      return res.error({
        message: "Email is required.",
      });
    }

    if (!password) {
      return res.error({
        message: "Password is required.",
      });
    }

    const userCheck = await User.findOne({ email });
    if (userCheck)
      return res.error({
        message: "An account with that email already exists.",
        status: 409,
      });

    const hashedPassword = await hashPassword(password);

    if (!hashedPassword) return res.error({});

    const verificationToken = generateRandomNumbers(6).toString();
    const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt,
    });

    const html = generateVerificationMailTemplate({
      receiverName: name,
      verificationCode: verificationToken,
    });
    const subject = "Email Verification";

    const sent = await sendMail({
      html,
      receiverMail: email,
      subject,
    });

    if (!sent) {
      return res.error({ status: 500 });
    }

    await newUser.save();

    await setCookieToken(newUser._id.toString(), res, 15);

    res.success({ message: "Account created successfully.", status: 201 });
  } catch (error) {
    return res.error({
      status: 500,
      error: error,
    });
  }
};

export const verifyAccount = async (
  req: CustomRequest,
  res: CustomResponse
) => {
  try {
    const userId = req.user._id;
    const { code } = req.body;

    if (!code) return res.error({ message: "Verification code is required." });

    const user = await User.findById(userId);

    if (!user) return res.error({ message: "Account not found.", status: 404 });

    if (user.isVerified)
      return res.error({
        message: "Account is already verified.",
        status: 406,
      });

    if (user.verificationToken && user.verificationTokenExpiresAt) {
      const expiryDate = new Date(user.verificationTokenExpiresAt);

      if (user.verificationToken === code && expiryDate > new Date()) {
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        const subject = "Welcome Aboard!";
        const name = user.name.split(" ")[0];
        const html = generateWelcomeMailTemplate({ receiverName: name });

        await sendMail({ receiverMail: user.email, subject, html });

        res.success({ message: "Account verified successfully." });
      } else {
        return res.error({
          message: "Invalid or expired verification code.",
          status: 400,
        });
      }
    } else {
      return res.error({
        message: "No verification token found. Please request a new one.",
      });
    }
  } catch (error) {
    console.log("🚀 ~ Error verifying account:", error);
    return res.error({
      status: 500,
      error: error,
    });
  }
};

export const login = async (req: Request, res: CustomResponse) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.error({ message: "Email is required." });

    if (!password) return res.error({ message: "Password is required." });

    const user = await User.findOne({ email });

    if (!user)
      return res.success({
        status: 404,
        message: "Invalid email or password.",
      });

    const isPasswordValid = await verifyPassword(user.password, password);

    if (!isPasswordValid)
      return res.error({ message: "Invalid email or password." });

    await setCookieToken(user._id.toString(), res);

    const data = {
      isVerified: user.isVerified,
    };

    return res.success({ message: "Logged in successfully.", data });
  } catch (error) {
    console.log("🚀 ~ Error logging in:", error);
    return res.error({
      status: 500,
      error: error,
    });
  }
};

export const logout = async (req: CustomRequest, res: CustomResponse) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });

    req.user = null;

    res.success({ message: "Logged out successfully." });
  } catch (error) {
    console.log("🚀 ~ Error logging out:", error);
    res.error({ status: 500, error });
  }
};

export const forgotPassword = async (req: Request, res: CustomResponse) => {
  try {
    const { email } = req.body;

    if (!email) return res.error({ message: "Email is required." });

    const user = await User.findOne({ email });

    if (!user) return res.error({ message: "Account not found.", status: 404 });

    const resetPasswordToken = generateRandomString(30);
    const resetPasswordTokenExpiresAt = new Date(
      Date.now() + 1 * 60 * 60 * 1000
    );

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = resetPasswordTokenExpiresAt;

    await user.save();

    const resetLink = `${process.env.CLIENT_BASE_URL}/reset-password/${user._id}/${resetPasswordToken}`;
    const subject = "Reset Password";
    const html = generatePasswordResetMailTemplate({
      receiverName: user.name,
      expiry: `1 hour`,
      resetLink: resetLink,
    });

    await sendMail({ receiverMail: email, subject, html });

    res.success({ message: `A password reset link is sent to ${user.email}.` });
  } catch (error) {
    console.log("🚀 ~ Error resetting password:", error);
    return res.error({
      status: 500,
      error: error,
    });
  }
};

export const resetPassword = async (req: Request, res: CustomResponse) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    if (!id) return res.error({ message: "User Id is required." });
    if (!token)
      return res.error({ message: "Password reset token is required." });
    if (!password) return res.error({ message: "Password is required." });

    const user = await User.findById(id);

    if (!user)
      return res.success({ message: "Account not found.", status: 404 });

    if (user.resetPasswordToken && user.resetPasswordExpiresAt) {
      if (user.resetPasswordToken !== token)
        return res.error({ message: "Invalid or expired reset token." });

      const expiryDate = new Date(user.resetPasswordExpiresAt);

      if (expiryDate < new Date()) {
        return res.error({ message: "Invalid or expired reset token." });
      }

      const isPasswordSame = await verifyPassword(user.password, password);

      if (isPasswordSame)
        return res.error({
          message: "Password must not be same as current one.",
        });

      const hashedPassword = await hashPassword(password);

      if (!hashedPassword) return res.error({ status: 500 });

      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresAt = undefined;

      await user.save();

      const subject = "Password Updated";
      const html = generatePasswordResetSuccessMailTemplate({
        receiverName: user.name,
      });

      await sendMail({ receiverMail: user.email, subject, html });

      return res.success({
        status: 201,
        message: "Password updated successfully.",
      });
    } else {
      res.error({
        message: "No password reset token found. Please request a new one.",
      });
    }
  } catch (error) {
    console.log("🚀 ~ Error resetting password:", error);
    return res.error({
      status: 500,
      error: error,
    });
  }
};

export const checkSession = async (req: CustomRequest, res: CustomResponse) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.error({ message: "User not found" });
    }

    res.success({ data: user, message: "Session restored." });
  } catch (error) {
    console.log("🚀 ~ error:", error);

    res.error({ error, status: 500 });
  }
};
