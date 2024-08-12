import User from "../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomResponse } from "./responseMiddleware";
import { NextFunction } from "express";

export interface CustomRequest extends Request {
  body: any;
  cookies?: any;
  user?: any;
}

const strictVerifcation = async (
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    if (!token)
      return res.error({
        status: 401,
        message: "Unauthorized! Missing or invalid token.",
      });

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    if (!decodedToken)
      return res.error({
        status: 401,
        message: "Unauthorized! Missing or invalid token.",
      });

    if (decodedToken.userId) {
      const user = await User.findById(decodedToken.userId).select("-password");

      if (!user)
        return res.error({ status: 404, message: "Account not found." });

      req.user = user;
    }

    next();
  } catch (error) {
    console.log("🚀 ~ strictVerification middleware:", error);
    res.error({ status: 500, error });
  }
};

export default strictVerifcation;
