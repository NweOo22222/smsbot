import axios from "axios";
import { Router } from "express";
import Article from "./app/Article";
import DB from "./app/DB";
import Headline from "./app/Headline";
import Keyword from "./app/Keyword";
import Message from "./app/Message";

const router = Router();

router.get("/update", (req, res) =>
  Headline.fetch()
    .then((headlines) => {
      Headline.store(headlines);
      Article.fetch()
        .then((articles) => {
          Article.store(articles);
          res.status(201).json({ status: "updated" });
        })
        .catch((e) => {
          e.response ? res.send(e.response["data"]) : res.send(e.message);
        });
    })
    .catch((e) =>
      e.response ? res.send(e.response["data"]) : res.send(e.message)
    )
);

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
        'သတင်းအပြည့်အစုံကိုဖတ်ရန် - "read <id>" or "<ဂဏန်း၆လုံ> ဖတ်" ဥပမာ. read 450123',
        'ကျန်ရှိသည့်အရေအတွက်ကိုသိရန် - "count" or "ကျန်သေးလား"',
        'အစကပြန်လည်ရယူရန် - "reset" or "ပြန်စ"',
        "\n-by nweoo.com",
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
      const latest = Headline.getLatest(5, sent);
      db["phone"][inputMessage.phone.number]["times"]++;
      db["phone"][inputMessage.phone.number]["last_date"] = Date.now();
      db["phone"][inputMessage.phone.number]["headlines"].push(
        ...latest.map(({ id }) => id)
      );
      if (latest.length) {
        const text = latest
          .map(({ id, title }) => `(${id}) ${title}`)
          .join("\n");
        res.send(
          text +
            '\nနောက်ထပ်သတင်းများ "news"  အပြည့်အစုံဖတ်ရန် "read <id>"  ပိုမိုသိရှိရန် "help"'
        );
      } else {
        res.send(
          'နောက်ထပ်သတင်းများမရှိတော့ပါ။ သတင်းတွေကိုအစကရယူလိုပါက "reset" ဟုပို့ပါ။ သတင်းအပြည့်အစုံဖတ်လိုပါက "read <id>" ဟုပို့ပါ။ ဥပမာ. read 450111\n\nBot by nweoo.com'
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
      db["phone"][inputMessage.phone.number]["times"]++;
      db["phone"][inputMessage.phone.number]["last_date"] = Date.now();
      const article = db["articles"].find((article) => article["id"] == id);
      if (!article) {
        res.send(`သတင်း ${id} ကို ရှာမတွေ့ပါ။`);
        return;
      }
      let text = article["content"];
      if (text.length > 1000) {
        text = text.slice(0, 997) + "…";
      }
      res.send(`${text} - ${article["source"]}`);
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
      const tdy = Headline.getLatest(0, sent);
      const total = tdy.length + sent.length;
      const text = tdy.length
        ? `နောက်ထပ်သတင်း ${tdy.length} ခု ကျန်ပါတယ်။ သတင်းတစ်ပုဒ်ချင်းစီကိုဖတ်ရန် "read <id>" ဟုပို့ပါ။ ပိုမိုသိရှိရန် "help" ဟုပို့ပါ။\n\nBot by nweoo.com`
        : 'နောက်ထပ်သတင်းများပို့ရန်မကျန်တော့ပါ။ သတင်းတစ်ပုဒ်ချင်းစီကိုဖတ်ရန် "read <id>" ဟုပို့ပါ။ ပိုမိုသိရှိရန် "help" ဟုပို့ပါ။\n\nBot by nweoo.com';
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
        `သတင်းများကိုအစကနေပြန်လည်ရယူနိုင်ပါပြီ။ ပိုမိုသိရှိရန် "help" ဟုပို့ပါ။\n\nBot by nweoo.com`
      );
    });

    keyword.onUnexisted(() =>
      res.send(
        'လုပ်ဆောင်ချက်မအောင်မြင်ပါ။ ပိုမိုသိရှိရန် "help" ဟုပို့ပါ။\n\nBot by nweoo.com'
      )
    );
  }

  keyword.onUnexisted(() => res.status(400).end());
});

export default router;
