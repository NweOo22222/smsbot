import { NextFunction, Request, Response } from "express";
import Phone from "./app/Phone";
import { ON_RATE_LIMIT } from "./config";
import printf from "printf";
import { io } from "./socket";
import Config from "./app/Config";

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
  const reset = () => {
    session.reset();
    phone.save();
  };
  session.extend();
  if (message.match(/\.update/)) {
    res.redirect("/update");
    return res.end();
  }
  if (message.match(/\.reset/)) {
    reset();
    return res.end();
  }
  if (session.daily.isDenied()) {
    if (!session.daily.notified) {
      let response;
      let minute = Math.round(session.daily.remaining / 60);
      let hour = Math.round(minute / 60);

      if (hour < 1) {
        response = printf(
          ON_RATE_LIMIT,
          Config.get("MOBILE_NUMBER"),
          "နောက် " + minute + " မိနစ်နေမှ"
        );
      } else {
        response = printf(
          ON_RATE_LIMIT,
          Config.get("MOBILE_NUMBER"),
          "နောက် " + hour + " နာရီနေမှ"
        );
      }
      session.daily.notified = true;
      phone.save();
      io().emit("users:update", phone);
      return res.send(response);
    }
    return res.status(419).end();
  }
  if (session.hourly.isDenied()) {
    if (!session.hourly.notified) {
      let remain = Math.round(session.hourly.remaining / 60);
      let response = printf(
        ON_RATE_LIMIT,
        Config.get("MOBILE_NUMBER"),
        "နောက် " + remain + " မိနစ်နေမှ"
      );
      session.hourly.notified = true;
      phone.save();
      io().emit("users:update", phone);
      return res.send(response);
    }
    return res.status(419).end();
  }
  next();
}
