import { Router } from "express";
import Headline from "./app/Headline";
import Keyword from "./app/Keyword";
import Message from "./app/Message";
import Phone from "./app/Phone";
import { io } from "./socket";
import {
  ON_HEADLINES_NEXT,
  ON_HEADLINES_NULL,
  ON_HELP,
  ON_REMAINING_COUNT,
  ON_RESET,
  ON_UNEXISTED,
} from "./config";
import printf from "printf";
import { MOBILE_NUMBER } from "./settings";
import DB from "./app/DB";
import BreakingNews from "./app/BreakingNews";

const _tasks = {};
const router = Router();

router.get("/call", (req, res) => {
  const message = new Message({
    body: decodeURIComponent(String(req.query.message)),
    address: req["phone"],
  });
  const phone = message.phone;
  const keyword = new Keyword(message.body);

  keyword.onAskHelp(() => {
    let text = printf(ON_HELP, MOBILE_NUMBER);
    phone.incr({
      total_action: 1,
      character_count: text.length,
    });
    res.send(text);
    io().emit("users:update", { id: phone.id, type: "help" });
  });

  keyword.onAskHeadlines(() => {
    let actions: string[] = [];
    const highlights = BreakingNews.get(
      5,
      new Date(),
      phone.highlights
    ).reverse();
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
          character_count: 0,
        })
        .save();
      res.end();
    } else {
      let text = printf(ON_HEADLINES_NULL, MOBILE_NUMBER);
      phone
        .markAsSent(highlights, latest)
        .incr({
          total_action: 1,
          character_count: text.length,
        })
        .save();
      res.send(text);
    }
    io().emit("users:update", { id: phone.id, type: "news" });
  });

  keyword.onAskCount(() => {
    let remain = Headline.latest(0, phone.headlines).length;
    let text = printf(ON_REMAINING_COUNT, remain);
    phone
      .incr({
        total_action: 1,
        character_count: text.length,
      })
      .save();
    res.send(text);
  });

  keyword.onAskReset(() => {
    phone
      .reset()
      .incr({
        total_action: 1,
        character_count: ON_RESET.length,
      })
      .save();
    res.send(ON_RESET);
    io().emit("users:update", { id: phone.id, type: "reset" });
  });

  keyword.onAskCredit(() => {
    res.end();
    io().emit("users:update", { id: phone.id, type: "credit" });
  });

  keyword.onUnexisted(() => {
    let text = printf(ON_UNEXISTED, MOBILE_NUMBER);
    phone
      .incr({
        total_action: 1,
        character_count: text.length,
      })
      .save();
    res.send(text);
    io().emit("users:update", { id: phone.id, type: "unexisted" });
  });
});

router.get("/action", (req, res) => {
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
      character_count: text.length,
    })
    .save();
  res.send(text);
  io().emit("users:update", { id: phone.id, type: "action" });
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
      new BreakingNews({
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
