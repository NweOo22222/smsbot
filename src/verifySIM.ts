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
  setTimeout(() => {
    axios
      .get("http://localhost:8080/v1/sms")
      .then(({ data: { messages } }) => {
        messages = messages.filter(
          ({ msg_box, address, sim_slot, _id }) =>
            msg_box === "inbox" &&
            address === phone &&
            sim_slot == sim &&
            !threads.includes(_id)
        );
        threads.unshift(...messages.map(({ _id }) => _id));
        if (messages.length) {
          threads = threads.slice(0, 20);
          req["id"] = messages[0]["_id"];
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
  }, 5000);
}
