import { Router } from "express";
import Article from "./app/Article";
import Headline from "./app/Headline";
import Keyword from "./app/Keyword";
import Message from "./app/Message";
import Phone from "./app/Phone";
import { io } from "./socket";

const _tasks = {};
const router = Router();

router.get("/call", (req, res) => {
  const message = new Message({
    body: decodeURIComponent(String(req.query.message)),
    address: req["phone"],
  });
  const phone = message.phone;
  const keyword = new Keyword(message.body);

  let text: string;

  keyword.onAskHelp(() => {
    text = "သတင်းများရယူရန် news (သို့) သတင်း လို့ပို့ပါ။";
    phone.incr({
      total_action: 1,
      character_count: text.length,
      read_count: 0,
    });
    res.send(text);
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
            datetime.getDate() +
            "/" +
            Number(datetime.getMonth() + 1) +
            " " +
            title
        )
      );
      if (remain > 0) actions.push("- နောက်ထပ်ရယူလိုပါက news ဟုပို့ပါ။");
      _tasks[message.phone.number] = actions;
      phone
        .markAsSent(latest)
        .incr({
          total_action: 1,
          read_count: 0,
          character_count: 0,
        })
        .save();
      res.send("");
    } else {
      text = "သတင်းများနောက်ထပ်မရှိပါ။";
      phone
        .markAsSent(latest)
        .incr({
          total_action: 1,
          read_count: 0,
          character_count: text.length,
        })
        .save();
      res.send(text);
    }
    io().emit("users:update", { id: phone.id, type: "news" });
  });

  keyword.onAskRead((id) => {
    text = "သတင်းအပြည့်အစုံကိုပို့လို့အဆင်မပြေလို့ဖျက်သိမ်းလိုက်ပါပြီ။";
    phone
      .incr({
        total_action: 1,
        character_count: text.length,
        read_count: 0,
      })
      .save();
    res.send(text);
    io().emit("users:update", { id: phone.id, type: "read" });
  });

  keyword.onAskReset(() => {
    const text = "သတင်းများကိုအစကနေပြန်လည်ရယူနိုင်ပါပြီ။";
    phone.reset();
    phone
      .incr({
        total_action: 1,
        read_count: 0,
        character_count: text.length,
      })
      .save();
    res.send(text);
    io().emit("users:update", { id: phone.id, type: "reset" });
  });

  keyword.onUnexisted(() => {
    const text = "မှားနေပါတယ်။ သတင်းများရယူလိုပါက news ဟုပို့ပါ။";
    phone
      .incr({
        total_action: 1,
        character_count: text.length,
        read_count: 0,
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
      read_count: 0,
    })
    .save();
  res.send(text);
  io().emit("users:update", { id: phone.id, type: "action" });
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
