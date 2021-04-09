import { NextFunction, Request, Response } from "express";
import Phone from "./app/Phone";

export default function middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if ("phone" in req.query) {
    req["phone"] = String(req.query.phone).replace(/^\s/, "+");
    const phone = new Phone(req["phone"]);
    const message = decodeURIComponent(String(req.query["message"] || ""));
    if (phone) {
      const session = phone.session;
      const reset = () => {
        session.restart();
        phone.save();
        next();
      };
      if (message.match(/\.update/) || message.match(/\.reset/)) {
        return reset();
      }
      if (session.isExpired()) {
        return reset();
      }
      if (session.isDenied()) {
        return res
          .status(419)
          .send(
            "<#419> ဝန်ဆောင်မှုများထပ်မံမရရှိနိုင်တော့ပါ။ နောက်မှပြန်ပြီး ပို့ကြည့်ပါ။"
          );
      }
    }
    return next();
  }
  return next();
}