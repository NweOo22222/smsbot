import { Router } from "express";
import { io } from "./socket";
import Config from "./app/Config";
import axios from "axios";
import middleware from "./middleware";
import Message from "./app/Message";
import Headline from "./app/Headline";
import {
  ON_HEADLINES_NEXT,
  ON_HEADLINES_NULL,
  ON_HELP,
  ON_HELP_REPORTER,
  ON_RATE_LIMIT,
  ON_REMAINING_COUNT,
  ON_RESET,
  ON_SEARCH_EXISTED,
  ON_UNEXISTED,
} from "./config";
import Keyword from "./app/Keyword";
import { SMS_GATEWAY_API } from "./settings";
import printf from "printf";
import Highlight from "./app/Highlight";

let _tasks = {};
const router = Router();

router.get("/online", middleware, (req, res) => {
  const message = new Message({
    body: decodeURIComponent(String(req.query.message)),
    address: req["phone"],
  });
  const phone = message.phone;
  const keyword = new Keyword(message.body);

  keyword.onAskHelp(() => {
    let text = printf(ON_HELP, Config.get("MOBILE_NUMBER"));
    phone.incr({
      total_action: 1,
    });
    axios
      .get(
        `${SMS_GATEWAY_API}/send?phone=${
          phone.number
        }&message=${encodeURIComponent(text)}`
      )
      .then(() => {
        res.end();
        io().emit("users:update", phone);
      })
      .catch((e) => {
        console.log(e);
        console.log("> Error on sending message to server...");
        res.status(500).end();
      });
  });

  keyword.onAskHeadlines(() => {
    let actions: string[] = [];
    const highlights = Highlight.get(5, new Date(), phone.highlights).reverse();
    const latest = Headline.latest(
      5 - highlights.length,
      phone.headlines
    ).reverse();
    const remain = Headline.latest(0, phone.headlines).length;
    const result = [...highlights, ...latest];
    if (result.length) {
      actions.push(
        ...result.map(
          ({ title, datetime }) =>
            title +
            " " +
            datetime.getDate() +
            "/" +
            Number(datetime.getMonth() + 1)
        )
      );
      if (remain > 0 && phone.session.hourly.total_action <= 1) {
        actions.push(printf(ON_HEADLINES_NEXT, remain - latest.length));
      }
      _tasks[message.phone.number] = actions;
      phone
        .markAsSent(highlights, latest)
        .incr({
          total_action: 1,
        })
        .save();
      actions.forEach((action) =>
        axios
          .get(
            `${SMS_GATEWAY_API}/send?phone=${
              phone.number
            }&message=${encodeURIComponent(action)}`
          )
          .then(() => {
            console.log("bulkSMS: sent");
          })
          .catch((e) => {
            console.log(e);
            console.log("> Error on sending message to server...");
          })
      );
      res.end();
    } else {
      let text = printf(ON_HEADLINES_NULL, Config.get("MOBILE_NUMBER"));
      phone
        .markAsSent(highlights, latest)
        .incr({
          total_action: 1,
        })
        .save();
      axios
        .get(
          `${SMS_GATEWAY_API}/send?phone=${
            phone.number
          }&message=${encodeURIComponent(text)}`
        )
        .then(() => {
          res.end();
          io().emit("users:update", phone);
        })
        .catch((e) => {
          console.log(e);
          console.log("> Error on sending message to server...");
          res.status(500).end();
        });
    }
    io().emit("users:update", phone);
  });

  keyword.onAskCount(() => {
    let remain = Headline.latest(0, phone.headlines).length;
    let text = printf(ON_REMAINING_COUNT, remain);
    phone
      .incr({
        total_action: 1,
      })
      .save();
    axios
      .get(
        `${SMS_GATEWAY_API}/send?phone=${
          phone.number
        }&message=${encodeURIComponent(text)}`
      )
      .then(() => {
        res.end();
        io().emit("users:update", phone);
      })
      .catch((e) => {
        console.log(e);
        console.log("> Error on sending message to server...");
        res.status(500).end();
      });
  });

  keyword.onAskReset(() => {
    let text = printf(ON_RESET, Config.get("MOBILE_NUMBER"));
    phone
      .reset()
      .incr({
        total_action: 1,
      })
      .save();
    axios
      .get(
        `${SMS_GATEWAY_API}/send?phone=${
          phone.number
        }&message=${encodeURIComponent(text)}`
      )
      .then(() => {
        res.end();
        io().emit("users:update", phone);
      })
      .catch((e) => {
        console.log(e);
        console.log("> Error on sending message to server...");
        res.status(500).end();
      });
    io().emit("users:update", phone);
  });

  keyword.onUnmatched(() => {
    let text = printf(ON_UNEXISTED, Config.get("MOBILE_NUMBER"));
    phone
      .incr({
        total_action: 1,
      })
      .save();
    axios
      .get(
        `${SMS_GATEWAY_API}/send?phone=${
          phone.number
        }&message=${encodeURIComponent(text)}`
      )
      .then(() => {
        res.end();
        io().emit("users:update", phone);
      })
      .catch((e) => {
        console.log(e);
        console.log("> Error on sending message to server...");
        res.status(500).end();
      });
    io().emit("users:update", phone);
  });
});
