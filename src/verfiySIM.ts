import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { USE_SIM_SLOT } from "./settings";

export default function verfiySIM(
  req: Request,
  res: Response,
  next: NextFunction
) {
  axios
    .get("http://192.168.100.99:8080/v1/sms?limit=50")
    .then(({ data: { messages } }) => {
      const matched = messages
        .filter(({ msg_box }) => msg_box === "inbox")
        .find(
          ({ address, sim_slot }) =>
            address == String(req["phone"]) && sim_slot == USE_SIM_SLOT
        );
      if (!matched) {
        return res.status(500).end();
      }
      next();
    })
    .catch((e) => {
      res.status(500).end();
      throw e;
    });
}
