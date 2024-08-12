import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto, { randomInt } from "crypto";
import { CustomResponse } from "../middlewares/responseMiddleware";

export const hashPassword = async (password: string) => {
  if (!password) {
    return null;
  }

  try {
    const rounds = parseInt(process.env.salt || "10");
    const salt = await bcrypt.genSalt(rounds);
    const hashedPassword = bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.log("🚀 ~ Error hashing password:", error);
    return null;
  }
};

export const verifyPassword = async (
  hashedPassword: string,
  password: string
) => {
  if (!hashedPassword || !password) return false;
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};

export const setCookieToken = async (
  userId: string,
  res: CustomResponse,
  numberOfDays: number = 15
) => {
  const secret = process.env.JWT_SECRET;

  if (secret) {
    const token = jwt.sign({ userId }, secret, {
      expiresIn: `${numberOfDays}d`,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: numberOfDays * 24 * 60 * 60 * 1000, // 15 days
      sameSite: "strict",
    });
  }
};

export const generateRandomString = (length: number) => {
  const generatedString = crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "") // remove everthing except letters and numbers
    .substring(0, length); // trim to given length

  return generatedString;
};

export const generateRandomNumbers = (length: number) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  const randomNum = randomInt(min, max + 1);
  return randomNum;
};
