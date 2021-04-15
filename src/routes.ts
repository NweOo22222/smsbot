import { Router } from "express";
import printf from "printf";
import Headline from "./app/Headline";
import Keyword from "./app/Keyword";
import Message from "./app/Message";
import Phone from "./app/Phone";
import Highlight from "./app/Highlight";
import DB from "./app/DB";
import { io } from "./socket";
import {
  ON_HEADLINES_NEXT,
  ON_HEADLINES_NULL,
  ON_HELP,
  ON_REMAINING_COUNT,
  ON_RESET,
  ON_UNEXISTED,
} from "./config";
import middleware from "./middleware";
import axios from "axios";
import Config from "./app/Config";

const _tasks = {};
const router = Router();

router.get("/call", middleware, async (req, res) => {
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
    res.send(text);
    io().emit("users:update", phone);
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
      if (remain > 0 && phone.session.total_action < 1) {
        actions.push(printf(ON_HEADLINES_NEXT, remain - latest.length));
      }
      _tasks[message.phone.number] = actions;
      phone
        .markAsSent(highlights, latest)
        .incr({
          total_action: 1,
        })
        .save();
      res.end();
    } else {
      let text = printf(ON_HEADLINES_NULL, Config.get("MOBILE_NUMBER"));
      phone
        .markAsSent(highlights, latest)
        .incr({
          total_action: 1,
        })
        .save();
      res.send(text);
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
    res.send(text);
  });

  keyword.onAskReset(() => {
    phone
      .reset()
      .incr({
        total_action: 1,
      })
      .save();
    res.send(ON_RESET);
    io().emit("users:update", phone);
  });

  keyword.onAskInfo(() => {
    res.redirect(
      "/call?phone=" +
        phone.number +
        "&operator=" +
        phone.operator +
        "&message=help"
    );
    res.end();
  });

  keyword.onUnexisted(() => {
    let text = printf(ON_UNEXISTED, Config.get("MOBILE_NUMBER"));
    phone
      .incr({
        total_action: 1,
      })
      .save();
    res.send(text);
    io().emit("users:update", phone);
  });
});

router.get("/action", async (req, res) => {
  let text: string;
  let number = req["phone"];
  if (typeof _tasks[number] !== "object" || !_tasks[number].length) {
    return res.status(400).end();
  }
  const phone = new Phone(number);
  text = _tasks[number].shift();
  if (!_tasks[number].length) {
    _tasks[number] = undefined;
    delete _tasks[number];
  }
  phone
    .incr({
      total_action: 0,
    })
    .save();
  res.send(text);
  io().emit("users:update", phone);
});

router.get("/update", (req, res) =>
  Headline.fetch()
    .then((articles) => {
      Headline.store(articles);
      res.status(201).send("0");
    })
    .catch((e) => res.status(400).end())
);

router.post("/update", (req, res) => {
  let { title, source, timestamp } = req.body;
  if (!(title && source && timestamp)) {
    return res.redirect(req.headers["referer"] || "/articles.html");
  }
  const db = DB.read();
  if (!("highlights" in db)) db["highlights"] = [];
  const highlights = db["highlights"];
  title.split("\n").forEach((title) => {
    highlights.push(
      new Highlight({
        id: highlights.length + 1,
        title,
        source,
        timestamp,
      })
    );
  });
  DB.save(db);
  res.redirect("/articles.html");
});

export default router;
