import axios from "axios";
import e, { Router } from "express";
import Article from "./app/Article";
import DB from "./app/DB";
import HeadlineNews from "./app/HeadlineNews";
import Keyword from "./app/Keyword";
import Message from "./app/Message";
import SMS from "./app/SMS";

const router = Router();

router.get("/update", (req, res) => {
  HeadlineNews.fetch().then((headlines) => {
    HeadlineNews.store(headlines);
    Article.fetch().then((articles) => {
      Article.store(articles);
      res.status(201).json({ status: "updated" });
    });
  });
});

router.get("/call", (req, res) => {
  let { phone, message } = req.query;
  phone = String(phone).replace(/^\s/, "+");
  message = decodeURIComponent(String(message));
  let inputMessage = new Message({
    body: message,
    address: phone,
    sim_slot: "0",
    msg_box: "inbox",
    timestamps: Date.now.toString(),
    _id: 0,
  });
  const keyword = new Keyword(inputMessage.body);

  keyword.onUpdate(() => {
    axios
      .get("http://localhost:3000/update")
      .then(() =>
        res.send("[Command] Updated at " + new Date().toLocaleString())
      );
  });

  if (inputMessage.via("Telenor")) {
    const db = DB.read();
    keyword.onAskHelp(() => {
      if (!(inputMessage.phone.number in db["phone"])) {
        db["phone"][inputMessage.phone.number] = {
          times: 0,
          first_date: Date.now(),
          last_date: Date.now(),
          headlines: [],
        };
      }
      const text = [
        'သတင်းများရယူရန် - "news" or "သတင်း" or "ဘာထူးလဲ"',
        'သတင်းရေတွက်ကိုသိရန် - "count" or "ကျန်သေးလား" or "ဒါပဲလား"',
        'အစကပြန်ရယူရန် - "reset" or "ပြန်စ"',
        'သတင်းအပြည့်အစုံဖတ်ရန် - "read #" or "# ပို့ပေးပါ"',
        "\nBot by nweoo.com",
      ];
      db["phone"][inputMessage.phone.number]["times"]++;
      db["phone"][inputMessage.phone.number]["last_date"] = Date.now();
      DB.save(db);
      res.send(text.join("\n"));
    });

    keyword.onAskHeadlines(() => {
      if (!(inputMessage.phone.number in db["phone"])) {
        db["phone"][inputMessage.phone.number] = {
          times: 0,
          first_date: Date.now(),
          last_date: Date.now(),
          headlines: [],
        };
      }
      const sent = db["phone"][inputMessage.phone.number]["headlines"];
      const latest = HeadlineNews.getLatest(5, sent);
      db["phone"][inputMessage.phone.number]["times"]++;
      db["phone"][inputMessage.phone.number]["last_date"] = Date.now();
      db["phone"][inputMessage.phone.number]["headlines"].push(
        ...latest.map(({ id }) => id)
      );
      if (latest.length) {
        res.send(latest.map(({ id, title }) => `[${id}] ${title}`).join("\n"));
      } else {
        res.send(
          'သတင်းများပို့ရန်မကျန်တော့ပါ။ အစကပြန်စရန် "reset" သို့ "ပြန်စ" ဟုပို့ပါ။'
        );
      }
      DB.save(db);
    });

    keyword.onAskRead((id) => {
      if (!(inputMessage.phone.number in db["phone"])) {
        db["phone"][inputMessage.phone.number] = {
          times: 0,
          first_date: Date.now(),
          last_date: Date.now(),
          headlines: [],
        };
      }
      const sent = db["phone"][inputMessage.phone.number]["headlines"];
      db["phone"][inputMessage.phone.number]["times"]++;
      db["phone"][inputMessage.phone.number]["last_date"] = Date.now();
      if (!sent.includes(id)) {
        res.send(
          `#${id} ကို ပို့ဆောင်ထားခြင်းမရှိသေးပါ။ အကူအညီရယူရန် "help" or "ကူညီ" ဟုပို့ပါ။`
        );
        return;
      }
      const article = Object.values(db["articles"]).find(
        (article) => article["id"] == id
      );
      if (!article) {
        res.send(
          `#${id} ကိုရှာမတွေ့ပါ။ အဆင်မပြေမှုအတွက်တောင်းပန်ပါတယ်။ အကူအညီရယူရန် "help" or "ကူညီ" ဟုပို့ပါ။`
        );
        return;
      }
      let text = article["content"]
        .replace(/\n/gm, "  ")
        .replace(/\s{4}/gm, " ");
      if (text.length > 1000) {
        text = text.slice(0, 997) + "...";
      }
      res.send(`${text} - ${article["source"]} [nweoo.com]`);
    });

    keyword.onAskCount(() => {
      if (!(inputMessage.phone.number in db["phone"])) {
        db["phone"][inputMessage.phone.number] = {
          times: 0,
          first_date: Date.now(),
          last_date: Date.now(),
          headlines: [],
        };
      }
      const sent = db["phone"][inputMessage.phone.number]["headlines"];
      const tdy = HeadlineNews.getLatest(0, sent);
      const total = tdy.length + sent.length;
      const text =
        tdy.length < 0
          ? `သတင်းများ ${total} ခုအားလုံးကိုပို့ဆောင်ပြီးပါပြိ။ အစကပြန်စရန် "reset" သို့ "ပြန်စ" ဟုပို့ပါ။`
          : `သတင်းများ ${total} ခုရှိပြီး ${tdy.length} ခုပို့ရန်ကျန်ရှိသေးပါတယ်။`;
      db["phone"][inputMessage.phone.number]["times"]++;
      db["phone"][inputMessage.phone.number]["last_date"] = Date.now();
      res.send(text);
    });

    keyword.onAskReset(() => {
      if (!(inputMessage.phone.number in db["phone"])) {
        db["phone"][inputMessage.phone.number] = {
          times: 0,
          first_date: Date.now(),
          last_date: Date.now(),
          headlines: [],
        };
      }
      db["phone"][inputMessage.phone.number]["times"]++;
      db["phone"][inputMessage.phone.number]["last_date"] = Date.now();
      db["phone"][inputMessage.phone.number]["headlines"] = [];
      DB.save(db);
      res.send(
        `သတင်းများကိုအစကပြန်စပြီးပါပြီး။ သတင်းများရယူလိုပါက "news" or "သတင်း" ဟုပို့ပါ။ အကူအညီရယူရန် "help" or "ကူညီ" ဟုပို့ပါ။`
      );
    });

    keyword.onUnexisted(() => res.status(400).end());
  }
});

export default router;
