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
import { config } from "./settings";
import Article from "./app/Article";

const _tasks = {};
const router = Router();

router.get("/call", middleware, async (req, res) => {
  const message = new Message({
    body: decodeURIComponent(String(req.query.message)),
    address: req["phone"],
  });
  const phone = message.phone;
  const keyword = new Keyword(message.body);
  const session = phone.session;

  if (!session.unlimited && session.daily.isDenied()) {
    if (!session.daily.notified) {
      let error = printf(
        ON_RATE_LIMIT,
        "Daily",
        Config.get("MOBILE_NUMBER"),
        "နောက်" + burmeseNumber(remainingTime(session.daily.remaining))
      );
      session.daily.notified = true;
      phone.save();
      io().emit("users:update", phone);
      _tasks[phone.number] = [error];
      return res.end();
    }
    io().emit("users:update", phone);
    return res.status(419).end();
  }

  if (!session.unlimited && session.hourly.isDenied()) {
    if (!session.hourly.notified) {
      let error = printf(
        ON_RATE_LIMIT,
        "Hourly",
        Config.get("MOBILE_NUMBER"),
        "နောက်" + burmeseNumber(remainingTime(session.hourly.remaining))
      );
      session.hourly.notified = true;
      phone.save();
      io().emit("users:update", phone);
      _tasks[phone.number] = [error];
      return res.end();
    }
    io().emit("users:update", phone);
    return res.status(419).end();
  }

  phone.extend();

  keyword.onCommonMistake(() => {
    phone.incr({ total_action: 0 }).save();
    res.status(400).end();
  });

  keyword.onAskInfo(() => {
    let text = session.unlimited
      ? NO_SMS_LIMIT
      : printf(
          ON_SMS_LIMIT,
          burmeseNumber(remainingTime(session.hourly.remaining)),
          burmeseNumber(session.hourly.actions),
          burmeseNumber(remainingTime(session.daily.remaining)),
          burmeseNumber(session.daily.actions)
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

  keyword.onAskHelp(() => {
    let text = printf(ON_HELP, Config.get("MOBILE_NUMBER"));
    phone.notified_error = false;
    phone.incr({ total_action: 0 }).save();
    _tasks[phone.number] = [text];
    res.end();
  });

  keyword.onAskHeadlines(() => {
    let actions: string[] = [];
    const highlights = Highlight.get(5, new Date(), phone.highlights);
    const latest = Headline.latest(5 - highlights.length, phone.headlines);
    const remain =
      Headline.latest(null, phone.headlines).length - latest.length;
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
      if (remain > 5) {
        phone.notified_emtpy = false;
      }
      if (remain && session.hourly.total_action < 1) {
        actions.push(printf(ON_HEADLINES_NEXT, burmeseNumber(remain)));
      }
      _tasks[message.phone.number] = actions;
      phone.markAsSent(highlights, latest).incr({ total_action: 0 }).save();
      res.end();
    } else {
      let text = ON_HEADLINES_NULL;
      if (!phone.notified_emtpy) {
        phone.notified_emtpy = true;
        _tasks[phone.number] = [text];
        phone.incr({ total_action: 0.5 }).save();
      } else {
        phone.incr({ total_action: 1 }).save();
      }
      res.end();
    }
  });

  keyword.onAskRead((title) => {
    let text: string;
    if (!phone.premium) {
      text = phone.max_limit
        ? "သတ်မှတ်ထားသည့်အရေအတွက်ပြည့်သွားသည့်အတွက် နောက်နေ့မှပြန်လည်ရရှိပါမည်။ - nweoo.com"
        : "သတင်းအပြည်အစုံကိုပို့လို့အဆင်မပြေတော့လိုပိတ်ထားတယ်။ - nweoo.com";
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

  keyword.onAskReset(() => {
    let text = ON_RESET;
    phone.notified_error = false;
    phone.reset().incr({ total_action: 0.8 }).save();
    _tasks[phone.number] = [text];
    res.end();
  });

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

  keyword.onUnmatched(() => {
    let text = printf(ON_UNEXISTED, Config.get("MOBILE_NUMBER"));
    if (phone.total_count > 1) {
      if (!phone.notified_error) {
        phone.notified_error = true;
        _tasks[phone.number] = [text];
      }
      phone.incr({ total_action: 0.2 }).save();
    }
    res.end();
  });

  io().emit("users:update", phone);
  io().emit("messages:update", message.body);
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
  io().emit("users:update", phone);
  phone.incr({ total_action: 0.2, character_count: text.length }).save();
  res.send(text);
});

router.get("/update", (req, res) =>
  Headline.fetch()
    .then((articles) => {
      Headline.store(articles);
      res.send("updated");
    })
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

router.get("/indexes", (req, res) => {
  Article.update(Number(req.query.limit || "50"))
    .then((articles) => Article.store(articles))
    .then(() => res.send("OK"))
    .catch((e) => res.status(500).send(e.message));
});

export default router;
