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
  ON_SEARCH_EXISTED,
  ON_HEADLINES_NEXT,
  ON_HEADLINES_NULL,
  ON_HELP,
  ON_HELP_REPORTER,
  ON_REMAINING_COUNT,
  ON_RESET,
  ON_UNEXISTED,
} from "./config";
import middleware from "./middleware";
import axios from "axios";
import Config from "./app/Config";
import { MAX_CHARACTER_LIMIT, SMS_GATEWAY_API } from "./settings";
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

  phone.extend();

  keyword.onCommonMistake(() => {
    phone.incr({ total_action: 0.5 }).save();
    res.status(400).end();
  });

  keyword.onAskInfo(() => {
    let da = phone.session.daily.total_action;
    let dc = phone.session.daily.character_count;
    let ha = phone.session.hourly.total_action;
    let hc = phone.session.hourly.character_count;
    let dm = Math.round(phone.session.daily.remaining / 60);
    let dh = Math.round(dm / 60);
    let dr = dh < 1 ? dm + " မိနစ်" : dh + " နာရီ";
    let hm = Math.round(phone.session.hourly.remaining / 60);
    let hr = hm + " မိနစ်";
    let text = phone.session.unlimited
      ? "သင့်ဖုန်းနံပါတ်ကို SMS Limit သတ်မှတ်ထားခြင်းမရှိပါ။"
      : printf(
          "SMS Limit မပြည့်ရန် %sအတွင်း %d ကြိမ်နှင့် %sအတွင်း %d ကြိမ်ပို့နိုင်ပါတယ်။",
          hr,
          phone.session.hourly.actions,
          dr,
          phone.session.daily.actions
        );
    if (phone.premium) {
      text += " [PREMIUM]";
    }
    text += " - nweoo.com";
    phone.incr({ total_action: 0.5, character_count: text.length }).save();
    res.send(text);
  });

  keyword.onAskHelp(() => {
    let text = printf(ON_HELP, Config.get("MOBILE_NUMBER"));
    phone.incr({ total_action: 0.5 }).save();
    res.send(text);
  });

  keyword.onAskHeadlines(() => {
    let actions: string[] = [];
    const highlights = Highlight.get(5, new Date(), phone.highlights);
    const latest = Headline.latest(5 - highlights.length, phone.headlines);
    const remain =
      Headline.latest(null, phone.headlines).length - latest.length;
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
        actions.push(printf(ON_HEADLINES_NEXT, remain));
      }
      _tasks[message.phone.number] = actions;
      phone.markAsSent(highlights, latest).incr({ total_action: 0 }).save();
      res.end();
    } else {
      let text = printf(ON_HEADLINES_NULL, Config.get("MOBILE_NUMBER"));
      phone
        .markAsSent(highlights, latest)
        .incr({ total_action: 2, character_count: text.length })
        .save();
      res.send(text);
    }
  });

  keyword.onAskRead((title) => {
    let text: string;
    if (!phone.premium) {
      text = phone.max_limit
        ? "သတ်မှတ်ထားသည့်အရေအတွက်ပြည့်သွားသည့်အတွက် နောက်နေ့မှပြန်လည်ရရှိပါမည်။ - nweoo.com"
        : "သတင်းအပြည်အစုံကိုပို့လို့အဆင်မပြေတော့လိုပိတ်ထားတယ်။ - nweoo.com";
      phone.incr({ total_action: 1, character_count: text.length }).save();
      return res.send();
    }
    title = title.replace(/- ?\w+ \d+\/\d+$/gm, "").trim();
    const article = Article.fetchAll().find(
      (article) => article.title == title
    );
    if (!article) {
      text = `သတင်းခေါင်းစဥ် "${title}" ကိုရှာမတွေ့ပါ။ - nweoo.com`;
      phone.incr({ total_action: 1, character_count: text.length }).save();
      return res.send(text);
    }
    let characters = article.content?.length;
    let keywords = article.content.replace(/\n/gm, " ").split(" ");
    let max_chunk = Math.floor(characters / MAX_CHARACTER_LIMIT) || 1;
    let chunk = Math.floor(keywords.length / max_chunk);
    let chunks = [];
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
    let text = printf(
      ON_REMAINING_COUNT,
      Headline.latest(null, phone.headlines).length
    );
    phone.incr({ total_action: 0.5, character_count: text.length }).save();
    res.send(text);
  });

  keyword.onAskReset(() => {
    let text = ON_RESET;
    phone
      .reset()
      .incr({ total_action: 1, character_count: text.length })
      .save();
    res.send(text);
  });

  keyword.onSearchContent((keyword) => {
    let articles: any = Article.fetchAll().filter((article) =>
      article.find(keyword)
    );
    let total = articles.length;
    articles = articles
      .filter((article) => !phone.headlines.includes(article.id))
      .map((article) => article.toHeadline());
    let text = printf(ON_SEARCH_EXISTED, keyword, total, articles.length);
    phone.incr({ total_action: 1 }).markAsSent([], articles).save();
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
    ].slice(0, 5);
    _tasks[phone.number] = articles;
    res.end();
  });

  keyword.onUnmatched(() => {
    let text = printf(ON_UNEXISTED, Config.get("MOBILE_NUMBER"));
    phone.incr({ total_action: 1 }).save();
    res.send(text);
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
