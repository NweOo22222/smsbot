import { Router } from "express";
import printf from "printf";
import Headline from "./app/Headline";
import Keyword from "./app/Keyword";
import Message from "./app/Message";
import Phone from "./app/Phone";
import Highlight from "./app/Highlight";
import DB from "./app/DB";
import burmeseNumber from "./functions/burmeseNumber";
import remainingTime from "./functions/remainingTime";
import { io } from "./socket";
import {
  ON_SEARCH_EXISTED,
  ON_HEADLINES_NEXT,
  ON_HEADLINES_NULL,
  ON_HELP,
  ON_REMAINING_COUNT,
  ON_REMAINING_COUNT_NULL,
  ON_SMS_LIMIT,
  ON_RESET,
  ON_UNEXISTED,
  NO_SMS_LIMIT,
  ON_RATE_LIMIT,
} from "./config";
import middleware from "./middleware";
import Config from "./app/Config";
import analytics from "./functions/analytics";
import verifySIM from "./verifySIM";
import axios from "axios";

const router = Router();
const _tasks = {};
let reports = [];

router.get("/call", middleware, verifySIM, (req, res) => {
  const message = new Message({
    body: decodeURIComponent(String(req.query.message)),
    address: req["phone"],
  });
  const phone = message.phone;
  const keyword = new Keyword(message.body);
  const session = phone.session;

  phone.extend().session.extend();

  // check daily session
  if (!session.unlimited && session.daily.isDenied()) {
    if (!session.daily.notified) {
      let error = printf(
        ON_RATE_LIMIT,
        burmeseNumber(remainingTime(session.daily.remaining))
      );
      session.daily.notified = true;
      phone.save();
      io().emit("users:update", phone);
      _tasks[phone.number] = [error];
      return res.end();
    }
    io().emit("users:update", phone);
    return res.status(429).end();
  }

  // check hourly session
  if (!session.unlimited && session.hourly.isDenied()) {
    if (!session.hourly.notified) {
      let error = printf(
        ON_RATE_LIMIT,
        burmeseNumber(remainingTime(session.hourly.remaining))
      );
      session.hourly.notified = true;
      phone.save();
      io().emit("users:update", phone);
      _tasks[phone.number] = [error];
      return res.end();
    }
    io().emit("users:update", phone);
    return res.status(429).end();
  }

  keyword.onAskInfo(() => {
    let dailyAction = Math.round(
      session.daily.actions / Number(Config.get("ACTION_SCORE"))
    );
    let hourlyAction = Math.round(
      session.hourly.actions / Number(Config.get("ACTION_SCORE"))
    );
    let text = session.unlimited
      ? NO_SMS_LIMIT
      : printf(
          ON_SMS_LIMIT,
          burmeseNumber(remainingTime(session.hourly.remaining)),
          burmeseNumber(hourlyAction),
          burmeseNumber(remainingTime(session.daily.remaining)),
          burmeseNumber(dailyAction)
        );
    if (phone.premium) {
      text += " [PREMIUM]";
    }
    text += " - nweoo.com";
    phone.notified_error = false;
    phone.incr({ total_action: 0 }).save();
    _tasks[phone.number] = [text];
    res.end();
  });

  /* 
  // search news "...."
  keyword.onSearchContent((keyword) => {
    let articles: any = Article.fetchAll().filter((article) =>
      article.find(keyword)
    );
    let total = articles.length;
    articles = articles
      .filter((article) => !phone.headlines.includes(article.id))
      .map((article) => article.toHeadline())
      .slice(0, 5);
    let text = printf(ON_SEARCH_EXISTED, keyword, total, articles.length);
    phone.notified_error = false;
    phone.incr({ total_action: 0 }).markAsSent([], articles).save();
    let headlines = DB.read()["articles"];
    articles = [
      text,
      ...articles.map((article) => {
        const hl = headlines.find((h) => h.title == article.title);
        const ct = `${article.title} -${article.source}`;
        let d = hl && new Date(hl.datetime || hl.timestamp);
        return (
          ct + (hl ? " " + d.getDate() + "/" + Number(d.getMonth() + 1) : "")
        );
      }),
    ];
    _tasks[phone.number] = articles;
    res.end();
  }); 
  
  // read full articles
  keyword.onAskRead((title) => {
    let text: string;
    if (!phone.premium) {
      text = phone.max_limit
        ? "နောက်နေ့မှထပ်မံကြိုးစားကြည့်ပါ။ - nweoo.com"
        : "သတင်းအပြည့်အစုံပို့လို့အဆင်မပြေပါ။ - nweoo.com";
      if (!phone.notified_error) {
        phone.notified_error = true;
        phone.incr({ total_action: 0 }).save();
        _tasks[phone.number] = [text];
      }
      return res.end();
    }
    title = title.replace(/- ?\w+ \d+\/\d+$/gm, "").trim();
    const article = Article.fetchAll().find(
      (article) => article.title == title
    );
    if (!article) {
      text = `သတင်းခေါင်းစဥ် "${title}" ကိုရှာမတွေ့ပါ။ - nweoo.com`;
      phone.incr({ total_action: 0 }).save();
      _tasks[phone.number] = [text];
      return res.send(text);
    }
    let characters = article.content?.length;
    let keywords = article.content.replace(/\n/gm, " ").split(" ");
    let max_chunk = Math.floor(characters / config.MAX_CHARACTER_LIMIT) || 1;
    let chunk = Math.floor(keywords.length / max_chunk);
    let chunks = [];
    phone.notified_error = false;
    for (let i = 0; i < max_chunk; i++) {
      if (i + 1 === max_chunk) {
        chunks.push(keywords.slice(chunk * i).join("") + " -" + article.source);
      } else {
        chunks.push(
          keywords.slice(chunk * i, chunk * (i + 1)).join("") + " #" + (i + 1)
        );
      }
    }
    phone.read_count -= 1;
    phone
      .incr({
        total_action: 1,
      })
      .save();
    _tasks[phone.number] = [
      `စာလုံးရေ(${characters})လုံးရှိတဲ့အတွက်အချိန်ကြာမြင့်တတ်ပြီး(${chunks.length})စောင်ပို့ဆောင်နေပါတယ်။ - nweoo.com`,
      ...chunks,
    ];
    res.end();
  });

  // reset sent articles
  keyword.onAskReset(() => {
    phone.notified_error = false;
    phone.reset().incr({ total_action: 0.8 }).save();
    _tasks[phone.number] = [ON_RESET];
    res.end();
  });
  */

  keyword.onAskHeadlines(() => {
    let actions: string[] = [];
    let news_count = Number(Config.get("NEWS_PER_SMS"));
    const highlights = Highlight.get(news_count, new Date(), phone.highlights);
    const latest = Headline.latest(
      news_count - highlights.length,
      phone.headlines
    );
    const remain =
      Highlight.get(null, new Date(), phone.highlights).length +
      Headline.latest(null, phone.headlines).length -
      latest.length;
    const result = [...highlights, ...latest];
    if (result.length) {
      phone.notified_error = false;
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
      if (remain > news_count) {
        phone.notified_emtpy = false;
      }
      _tasks[message.phone.number] = actions;
      phone.markAsSent(highlights, latest).incr({ total_action: 0 }).save();
      res.end();
    } else {
      let text = ON_HEADLINES_NULL;
      if (!phone.notified_emtpy) {
        phone.notified_emtpy = true;
        _tasks[phone.number] = [text];
        phone.incr({ total_action: 0.8 }).save();
      } else {
        phone.incr({ total_action: 0.5 }).save();
      }
      res.end();
    }
  });

  keyword.onAskCount(() => {
    let count = Headline.latest(null, phone.headlines).length;
    let text = count
      ? printf(ON_REMAINING_COUNT, burmeseNumber(count))
      : ON_REMAINING_COUNT_NULL;
    phone.notified_error = false;
    phone.incr({ total_action: 0 }).save();
    _tasks[phone.number] = [text];
    res.end();
  });

  keyword.onCommonMistake(() => {
    res.status(400).end();
  });

  keyword.onUnmatched(() => {
    // let text = printf(ON_UNEXISTED, Config.get("MOBILE_NUMBER"));
    // if (phone.total_count > 1) {
    // if (!phone.notified_error) {
    // phone.notified_error = true;
    // _tasks[phone.number] = [text];
    // }
    // phone.incr({ total_action: 0 }).save();
    // }
    res.status(404).end();
  });

  if (reports.length) {
    console.log("[Queue:REPORT]", reports.length);
    reports.forEach((report) => {
      axios
        .post("https://api.nweoo.com/report", report)
        .then(({ data }) => {
          reports = reports.filter((_report) => _report !== report);
        })
        .catch((e) =>
          console.log("[ATTEMPT_FAILED:REPORT]", e.response?.data || e.message)
        );
    });
  }

  io().emit("users:update", phone);
  io().emit("messages:update", message.body);
});

router.get("/action", analytics, async (req, res) => {
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
  io().emit("users:update", phone);
  phone.incr({ total_action: 0.2, character_count: text.length }).save();
  res.send(text);
});

router.get("/report", (req, res) => {
  let { phone, message } = req.query;
  if (!(phone && message)) {
    return res.status(400).end();
  }
  message = String(message)
    .replace(/#n[we]{2}oo/gim, "")
    .trim();
  const data = {
    phone,
    message,
    timestamp: Date.now(),
  };
  res.end();
  axios.post("https://api.nweoo.com/report", data).catch((e) => {
    console.log("[FAILED:REPORT]", reports.length);
    reports.push(data);
  });
});

router.get("/update", (req, res) =>
  Headline.fetch()
    .then(
      (articles) => Headline.store(articles) // Article.update(Number(req.query.limit || "50")).then((articles) => Article.store(articles))
    )
    .then(() => res.send("updated"))
    .catch((e) => res.send(e.message))
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
    title = String(title).trim();
    title &&
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
