import { Request, Response, NextFunction } from "express";

interface ErrorResponse {
  success: boolean;
  message: string;
  error?: any;
}

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  const response: ErrorResponse = {
    success: false,
    message,
    error: err,
  };

  res.status(statusCode).json(response);
};
