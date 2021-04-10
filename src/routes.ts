import { Router } from "express";
import Article from "./app/Article";
import Headline from "./app/Headline";
import Keyword from "./app/Keyword";
import Message from "./app/Message";
import Phone from "./app/Phone";
import { MAX_CHARACTER_PER_SMS } from "./config";

const _tasks = {};
const router = Router();

router.get("/call", (req, res) => {
  const message = new Message({
    body: decodeURIComponent(String(req.query.message)),
    address: req["phone"],
  });
  const phone = message.phone;
  const keyword = new Keyword(message.body);

  keyword.onUpdate(() => {
    res.redirect("/update");
    res.end();
  });

  if (message.via("Telenor")) {
    keyword.onAskHelp(() => {
      if (keyword.meta.slice(0, 4) == "read") {
        _tasks[message.phone.number] = [
          "<နံပါတ်၆လုံး> ဆိုတဲ့နေရာမှာသတင်းအရှေ့မှာပါတဲ့နံပါတ်ကိုပြောင်းထည့်ပေးပါ။",
        ];
      } else {
        _tasks[message.phone.number] = [
          "သတင်းများရယူရန် - news / သတင်း / ဘာထူးလဲ",
          "သတင်းအပြည့်အစုံကိုဖတ်ရန် - read <နံပါတ်၆လုံး>  / <နံပါတ်၆လုံး> ဖတ်ရန်",
          "ကျန်ရှိသည့်အရေအတွက်ကိုသိရန် - count / ကျန်သေးလား",
          "တို့ပို့ပြီးရယူနိုင်ပါတယ်။ <နံပါတ်၆လုံး> ဆိုတာသတင်းခေါင်းစဥ်အရှေ့ကအမှတ်စဥ်ကိုဆိုလိုတာပါ။",
        ];
      }
      res.send("");
    });

    keyword.onAskHeadlines(() => {
      let text: string[] = [];
      const latest = Headline.latest(5, phone.headlines);
      const remain = Headline.latest(0, phone.headlines).length - latest.length;
      if (latest.length) {
        text.push(...latest.map(({ id, title }) => `${id} -${title}`));
        if (remain > 0) text.push("- နောက်ထပ်ရယူလိုပါက news ဟုပို့ပါ။");
        _tasks[message.phone.number] = text;
        phone
          .markAsSent(latest)
          .incr({
            total_action: 0,
            read_count: 0,
            character_count: 0,
          })
          .save();
        res.send("");
      } else {
        res.send("နောက်ထပ်သတင်းများမရှိပါ။");
      }
    });

    keyword.onAskRead((id) => {
      if (!phone.session.canReadArticle()) {
        res.status(419);
        res.send(
          "<#419> သတင်းအပြည့်အစုံများကိုထပ်မံ၍မရနိုင်ပါ။ နောက်မှထပ်မံပို့ကြည့်ပါ။"
        );
        return;
      }
      const article = Article.find(id);
      if (!article) return res.send(`သတင်း ${id} ကို ရှာမတွေ့ပါ။`);
      let text = String(article["content"]);
      let n = Math.floor(text.length / MAX_CHARACTER_PER_SMS);
      let x = text.split(" ");
      let c = [
        "စာလုံးရေ" + text.length + "လုံးရှိတဲ့အတွက်အချိန်ကြာမြင့်နိုင်ပါ။",
      ];
      let z = Math.floor(x.length / n);
      for (let i = 0; i < n; i++) {
        let p = i + 1;
        if (p === n) {
          c.push(x.slice(i * z).join(" ") + " -" + article["source"]);
        } else {
          c.push(x.slice(i * z, p * z).join("") + " " + p + "/" + n);
        }
      }
      _tasks[message.phone.number] = c;
      phone
        .incr({
          total_action: 1,
          character_count: 0,
          read_count: 1,
        })
        .save();
      res.send("");
    });

    keyword.onAskCount(() => {
      const tdy = Headline.latest(0, []);
      const text = tdy.length
        ? `နောက်ထပ်သတင်း ${tdy.length} ခု ကျန်ပါတယ်။`
        : "နောက်ထပ်သတင်းများမရှိပါ။";
      phone
        .incr({
          total_action: 1,
          read_count: 0,
          character_count: text.length,
        })
        .save();
      res.send(text);
    });

    keyword.onAskReset(() => {
      const text = "သတင်းများကိုအစကနေပြန်လည်ရယူနိုင်ပါပြီ။";
      phone
        .incr({
          total_action: 1,
          read_count: 0,
          character_count: text.length,
        })
        .save();
      res.send(text);
    });

    keyword.onUnexisted(() => {
      const text = "မှားယွင်းနေပါတယ်။ အကူညီရယူလိုပါက help ဟုပို့ပါ။";
      phone
        .incr({
          total_action: 1,
          character_count: text.length,
          read_count: 0,
        })
        .save();
      res.send(text);
    });
  }

  keyword.onUnexisted(() => res.status(400).end());
});

router.get("/action", (req, res) => {
  let text;
  let number = req["phone"];
  if (!(number in _tasks)) {
    res.status(400);
    res.end();
    return;
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
      read_count: 0,
    })
    .save();
  res.send(text || "0");
});

router.get("/update", (req, res) =>
  Article.fetch()
    .then((articles) => {
      Article.store(articles);
      res.status(201).send("0");
    })
    .catch((e) => res.status(400).end())
);

export default router;
