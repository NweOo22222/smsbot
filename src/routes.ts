import axios from "axios";
import { Router } from "express";
import Article from "./app/Article";
import DB from "./app/DB";
import Headline from "./app/Headline";
import Keyword from "./app/Keyword";
import Message from "./app/Message";

const router = Router();
const _tasks = {};

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
        'သတင်းအပြည့်အစုံကိုဖတ်ရန် - "read [id]" or "[id] ဖတ်" ဥပမာ။ read 450123',
        'ကျန်ရှိသည့်အရေအတွက်ကိုသိရန် - "count" or "ကျန်သေးလား"',
        'အစကပြန်လည်ရယူရန် - "reset" or "ပြန်စ"',
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
      const latest = Headline.getLatest(5, sent);
      const remain = Headline.getLatest(0, sent).length - 5;
      db["phone"][inputMessage.phone.number]["times"]++;
      db["phone"][inputMessage.phone.number]["last_date"] = Date.now();
      db["phone"][inputMessage.phone.number]["headlines"].push(
        ...latest.map(({ id }) => id)
      );
      if (latest.length) {
        let text = latest.map(({ id, title }) => `[${id}] ${title}`).join("\n");
        if (remain) {
          text +=
            " \n\nနောက်ထပ်သတင်း " +
            remain +
            ' ခုကျန်ပါတယ်။ ထပ်မံရယူရန် "news" ဟုပို့ပါ။';
        }
        text += ' အပြည့်အစုံဖတ်ရန် "read [id]" လို့ပို့ပါ။';
        res.send(text + "\n#NweOoSMSBot nweoo.com");
      } else {
        res.send(
          'နောက်ထပ်သတင်းများမရှိတော့ပါ။ သတင်းတွေကိုအစကရယူလိုပါက "reset" ဟုပို့ပါ။ သတင်းအပြည့်အစုံဖတ်လိုပါက "read [id]" ဟုပို့ပါ။ ဥပမာ. read 450111'
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
      let text = String(article["content"]);
      let n = Math.floor(text.length / 600);
      let x = text.split(" ");
      let c = [];
      let z = Math.floor(x.length / n);
      for (let i = 0; i < n; i++) {
        let p = i + 1;
        if (p === n) {
          c.push(
            x.slice(i * z).join(" ") + " -" + article["content"]["source"]
          );
        } else {
          c.push(x.slice(i * z, p * z).join(" ") + " (" + p + "/" + n + ")");
        }
      }
      _tasks[inputMessage.phone.number] = c;
      res.send("");
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
      const text = tdy.length
        ? `နောက်ထပ်သတင်း ${tdy.length} ခု ကျန်ပါတယ်။ သတင်းတစ်ပုဒ်စီဖတ်ရန် "read [id]" ဟုပို့ပါ။ ပိုမိုသိရှိရန် "help" ဟုပို့ပါ။`
        : 'နောက်ထပ်သတင်းများပို့ရန်မကျန်တော့ပါ။ သတင်းတစ်ပုဒ်စီဖတ်ရန် "read [id]" ဟုပို့ပါ။ ပိုမိုသိရှိရန် "help" ဟုပို့ပါ။';
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
      res.send("သတင်းများကိုအစကနေပြန်လည်ရယူနိုင်ပါပြီ။");
    });

    keyword.onUnexisted(() =>
      res.send('လုပ်ဆောင်ချက်မအောင်မြင်ပါ။ ပိုမိုသိရှိရန် "help" ဟုပို့ပါ။')
    );
  }

  keyword.onUnexisted(() => res.status(400).end());
});

router.get("/action/:token", (req, res) => {
  const { token } = req.params;
  if (!(String(token) in _tasks)) {
    return res.send("");
  }
  res.send(_tasks[String(token)].shift());
});

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

export default router;
