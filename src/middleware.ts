import { NextFunction, Request, Response } from "express";
import DB from "./app/DB";
import Phone from "./app/Phone";

export default function middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if ("phone" in req.query) {
    req["phone"] = String(req.query.phone).replace(/^\s/, "+");
    const phone = new Phone(req["phone"]);

    if (phone) {
      const session = phone.session;

      if (session.isExpired()) {
        session.restart();
        phone.save();
        return next();
      }

      if (session.isDenied()) {
        const message = req.query["message"];
        if (message === ".update") {
          session.restart();
          phone.save();
          return next();
        }

        return res
          .status(419)
          .send(
            "<#419> ဝန်ဆောင်မှုများထပ်မံမရရှိနိုင်တော့ပါ။ နောက်မှပြန်ပြီး ပို့ကြည့်ပါ။"
          );
      }
    }

    return next();
  } else {
    if ("allow_me" in req.query) {
      return next();
    }
    return res.status(400).send("");
  }
}
