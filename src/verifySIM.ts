import axios from "axios";
import { NextFunction, Request, Response } from "express";
import Config from "./app/Config";

let threads = [];

export default function verifySIM(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const phone = req.query["phone"];
  const sim = Number(Config.get("USE_SIMSLOT"));
  if ("test" in req.query || sim == -1) {
    return next();
  }
  axios
    .get("http://localhost:8080/v1/sms?limit=20")
    .then(({ data: { messages } }) => {
      messages = messages.filter(
        (message) =>
          message.msg_box === "inbox" &&
          message.address === phone &&
          message.sim_slot == sim &&
          !threads.includes(message._id)
      );
      if (messages.length) {
        threads.push(...messages.map(({ _id }) => _id));
        let s = threads.length - 20;
        threads = s > 0 ? threads.slice(s, 20) : threads;
        next();
      } else {
        console.log("ignored to response %s, SIM Slot not matched", phone);
        res.status(401).end();
      }
    })
    .catch((e) => {
      console.log(e.message, "Could not verify SIM Slot %s", sim);
      next();
    });
}
