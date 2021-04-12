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
  ON_RESET,
  ON_UNEXISTED,
} from "./config";

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
    phone.incr({
      total_action: 1,
      character_count: ON_HELP.length,
    });
    res.send(ON_HELP);
    io().emit("users:update", { id: phone.id, type: "help" });
  });

  keyword.onAskHeadlines(() => {
    let actions: string[] = [];
    const latest = Headline.latest(5, phone.headlines);
    const remain = Headline.latest(0, phone.headlines).length - latest.length;
    if (latest.length) {
      actions.push(
        ...latest.map(
          ({ title, datetime }) =>
            title +
            " (" +
            datetime.getDate() +
            "/" +
            Number(datetime.getMonth() + 1) +
            ")"
        )
      );
      // if (remain > 0) actions.push(ON_HEADLINES_NEXT);
      _tasks[message.phone.number] = actions;
      phone
        .markAsSent(latest)
        .incr({
          total_action: 1,
          character_count: 0,
        })
        .save();
      res.end();
    } else {
      phone
        .markAsSent(latest)
        .incr({
          total_action: 1,
          character_count: ON_HEADLINES_NULL.length,
        })
        .save();
      res.send(ON_HEADLINES_NULL);
    }
    io().emit("users:update", { id: phone.id, type: "news" });
  });

  keyword.onAskReset(() => {
    phone.reset();
    phone
      .incr({
        total_action: 1,
        character_count: ON_RESET.length,
      })
      .save();
    res.send(ON_RESET);
    io().emit("users:update", { id: phone.id, type: "reset" });
  });

  keyword.onUnexisted(() => {
    phone
      .incr({
        total_action: 1,
        character_count: ON_UNEXISTED.length,
      })
      .save();
    res.send(ON_UNEXISTED);
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

export default router;
