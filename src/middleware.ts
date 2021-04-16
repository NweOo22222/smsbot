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
  session.extend();
  if (message.match(/^\.update$/)) {
    res.redirect("/update");
    return res.end();
  }
  if (message.match(/^\.reset$/)) {
    session.daily.reset();
    session.hourly.reset();
    phone.save();
    return res.end();
  }
  if (message.match(/^\.banned$/)) {
    session.banned = !Boolean(session.banned);
    phone.save();
    return res.status(401).end();
  }
  if (session.banned) {
    return res.status(403).end();
  }
  if (message.match(/^on$/i) && session.disabled) {
    session.disabled = false;
    phone.incr({ total_action: 1 });
    res.send("SMS Chatbot ကို ပြန်လည်စတင်လိုက်ပါပြီ။ - nweoo.com");
    phone.save();
    return res.end();
  }
  if (session.disabled) {
    return res.status(204).end();
  }
  if (message.match(/^off$/i)) {
    session.disabled = true;
    phone.save();
    res.send("SMS Chatbot ကို ပြန်လည်ဖွင့်လိုပါက ON ဟုပို့ပါ။ - nweoo.com");
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
  phone.save();
  next();
}
