import { NextFunction, Request, Response } from "express";
import Phone from "./app/Phone";
import Config from "./app/Config";
import { io } from "./socket";

export default function middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!("phone" in req.query)) {
    return res.status(400).end();
  }
  let match;
  const phone = new Phone(req["phone"]);
  const message = decodeURIComponent(String(req.query["message"] || ""));
  const session = phone.session;
  session.extend();
  match = message.match(/^\.reset ?(hourly|daily)?$/);
  if (match) {
    switch (match[1] || "") {
      case "hourly":
        session.hourly.reset();
        break;
      case "daily":
        session.daily.reset();
        break;
      default:
        session.reset();
    }
    phone.save();
    io().emit("users:update", phone);
    return res.end();
  }
  match = message.match(/^\.premium (\d+)$/);
  if (match) {
    let max_limit = parseInt(match[1] || 0);
    phone.max_limit = max_limit;
    phone.read_count = phone.max_limit;
    phone.premium = Boolean(phone.read_count);
    phone.save();
    io().emit("users:update", phone);
    return res.status(400).end();
  }
  if (message.match(/^\.unlimited$/)) {
    session.unlimited = !Boolean(session.unlimited);
    phone.save();
    io().emit("users:update", phone);
    return res.status(400).end();
  }
  if (message.match(/^\.update$/)) {
    res.redirect("/update");
    io().emit("users:update", phone);
    return res.end();
  }
  if (message.match(/^\.banned$/)) {
    session.banned = !Boolean(session.banned);
    phone.save();
    io().emit("users:update", phone);
    return res.status(400).end();
  }
  if (session.banned) {
    io().emit("users:update", phone);
    return res.status(403).end();
  }
  if (message.match(/^on$/i) && session.disabled) {
    session.disabled = false;
    phone.incr({ total_action: 1 });
    res.send("NweOo SMS Chatbot ကို စတင်အသုံးပြုနိုင်ပါပြီ။");
    phone.save();
    io().emit("users:update", phone);
    return res.end();
  }
  if (session.disabled) {
    io().emit("users:update", phone);
    return res.status(401).end();
  }
  if (message.match(/^off$/i)) {
    session.disabled = true;
    phone.save();
    io().emit("users:update", phone);
    return res.status(400).end();
  }
  if (!("test" in req.query) && phone.total_count > 10) {
    let r = Date.now() - phone.last_date.getTime();
    if (r !== 0 && r < Number(Config.get("SPAM_PROTECTION_TIME"))) {
      io().emit("users:update", phone);
      return res.status(422).end();
    }
  }
  next();
}
