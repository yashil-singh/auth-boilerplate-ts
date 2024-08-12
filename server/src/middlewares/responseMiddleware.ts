import { NextFunction, Request, Response } from "express";

export interface CustomResponse extends Response {
  success: (options: { data?: any; message?: string; status?: number }) => void;
  error: (options: { error?: any; message?: string; status?: number }) => void;
}

const responseMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customRes = res as CustomResponse;
  customRes.success = ({
    data,
    message = "Request was successful",
    status = 200,
  }) => {
    customRes.status(status).json({
      status,
      message,
      data,
    });
  };

  customRes.error = ({
    error,
    message = "Oops! Something went wrong.",
    status = 400,
  }) => {
    if (error?.name === "ValidationError") {
      const errors = Object.values(error.errors).map(
        (error: any) => error.message
      );

      customRes.status(status).json({
        status,
        errors: errors,
      });
    } else {
      customRes.status(status).json({
        status,
        message,
      });
    }
  };

  next();
};

export default responseMiddleware;
