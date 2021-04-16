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
  ON_HELP_REPORTER,
  ON_REMAINING_COUNT,
  ON_RESET,
  ON_UNEXISTED,
} from "./config";
import middleware from "./middleware";
import online from "./online";
import axios from "axios";
import Config from "./app/Config";
import { SMS_GATEWAY_API } from "./settings";

const _tasks = {};
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

  keyword.onUnexisted(() => {
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

router.get("/call", middleware, async (req, res) => {
  const message = new Message({
    body: decodeURIComponent(String(req.query.message)),
    address: req["phone"],
  });
  const phone = message.phone;
  const keyword = new Keyword(message.body);

  keyword.onAskReporter(() => {
    let text = printf(ON_HELP_REPORTER, Config.get("MOBILE_NUMBER"));
    phone.incr({ total_action: 1 });
    res.send(text);
    io().emit("users:update", phone);
  });

  keyword.onAskHelp(() => {
    let text = printf(ON_HELP, Config.get("MOBILE_NUMBER"));
    phone.incr({ total_action: 1 });
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
    const remain = Headline.latest(null, phone.headlines).length;
    const result = [...highlights, ...latest];
    if (result.length) {
      actions.push(
        ...result.map(
          ({ title, datetime, source }) =>
            title.split(" ").join("") +
            " -" +
            source +
            " " +
            datetime.getDate() +
            "/" +
            Number(datetime.getMonth() + 1)
        )
      );
      if (remain && phone.session.hourly.total_action < 1) {
        actions.push(printf(ON_HEADLINES_NEXT, remain - latest.length));
      }
      _tasks[message.phone.number] = actions;
      phone.markAsSent(highlights, latest).incr({ total_action: 1 }).save();
      res.end();
    } else {
      let text = printf(ON_HEADLINES_NULL, Config.get("MOBILE_NUMBER"));
      phone.markAsSent(highlights, latest).incr({ total_action: 1 }).save();
      res.send(text);
    }
    io().emit("users:update", phone);
  });

  keyword.onAskCount(() => {
    let text = printf(
      ON_REMAINING_COUNT,
      Headline.latest(null, phone.headlines).length
    );
    phone.incr({ total_action: 0 }).save();
    res.send(text);
  });

  keyword.onAskReset(() => {
    phone.reset().incr({ total_action: 1 }).save();
    res.send(ON_RESET);
    io().emit("users:update", phone);
  });

  keyword.onUnexisted(() => {
    let text = printf(ON_UNEXISTED, Config.get("MOBILE_NUMBER"));
    phone.incr({ total_action: 1 }).save();
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
  phone.incr({ total_action: 0 }).save();
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
  let i = 0;
  title.split("\n").forEach((title) => {
    highlights.push(
      new Highlight({
        id: (Date.now() + i++).toString(),
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
