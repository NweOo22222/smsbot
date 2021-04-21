import { NextFunction, Request, Response } from "express";

export default function analytics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();
}
