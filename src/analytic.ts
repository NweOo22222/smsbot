import { NextFunction, Request, Response } from "express";

export default function analytic(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req["phone"] = req.query["phone"] = String(req.query.phone).replace(
    /^(\s959|09)/,
    "+959"
  );
  next();
}
