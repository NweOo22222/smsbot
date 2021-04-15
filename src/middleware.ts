import { NextFunction, Request, Response } from "express";
import Phone from "./app/Phone";
import { ON_RATE_LIMIT } from "./config";
import printf from "printf";
import { io } from "./socket";
import { MOBILE_NUMBER } from "./settings";

export default function middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!("phone" in req.query)) {
    return res.status(400).end();
  }
  const phone = new Phone(req["phone"]);
  const message = decodeURIComponent(String(req.query["message"] || ""));
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
    reset();
    return res.end();
  }
  if (session.isExpired()) {
    reset();
    return next();
  }
  if (session.isDenied()) {
    return res.status(419).end();
  }
  if (session.isReachedLimit()) {
    let remain = Math.round(session.remaining / 60);
    let response = printf(
      ON_RATE_LIMIT,
      MOBILE_NUMBER,
      "နောက် " + remain + " မိနစ်နေမှ"
    );
    phone.incr({
      total_action: 1,
    });
    phone.save();
    io().emit("users:update", { id: phone.id, type: "limited" });
    return res.send(response);
  }
  next();
}
