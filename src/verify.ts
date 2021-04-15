import axios from "axios";
import { NextFunction, Request, Response } from "express";
import Config from "./app/Config";

export default function verify(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const SIM_SLOT = Config.get("SIM_SLOT");
  if (SIM_SLOT == -1) {
    return next();
  }
  axios
    .get("http://192.168.100.99:8080/v1/sms?limit=30")
    .then(({ data: { messages } }) => {
      messages = messages.filter(
        ({ address, msg_box }) => msg_box == "inbox" && address == req["phone"]
      );
      if (messages.length) {
        next();
      } else {
        res.status(426).end();
      }
    })
    .catch((e) => {
      console.log(e.message, "cannot verify SIM Slot");
      next();
    });
}
