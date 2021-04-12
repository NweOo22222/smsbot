import { NextFunction, Request, Response } from "express";
import Phone from "./app/Phone";
import { ON_RATE_LIMIT } from "./config";

export default function middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if ("version" in req.query) {
    req["_version"] = String(req.query.version);
  }
  if ("operator" in req.query) {
    req["operator"] = String(req.query.operator);
  }
  if ("phone" in req.query) {
    req["phone"] = String(req.query.phone).replace(/^\s/, "+");
    const phone = new Phone(req["phone"]);
    const message = decodeURIComponent(String(req.query["message"] || ""));
    if (phone) {
      const session = phone.session;
      const reset = (): boolean => {
        session.restart();
        phone.save();
        return true;
      };
      if (message.match(/\.update/)) {
        res.redirect("/update");
        return res.end();
      }
      if (message.match(/\.reset/)) {
        return reset() && res.end();
      }
      if (session.isExpired()) {
        return reset() && next();
      }
      if (session.isDenied()) {
        return res.status(419).end();
      }
      if (session.isReachedLimit()) {
        phone.incr({
          total_action: 1,
          character_count: ON_RATE_LIMIT.length,
        });
        phone.save();
        return res.status(419).send(ON_RATE_LIMIT);
      }
    }
    return next();
  }
  return next();
}
