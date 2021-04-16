import { NextFunction, Request, Response } from "express";
import { io } from "./socket";
import Config from "./app/Config";

export default function online(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();
}
