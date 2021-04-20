import { Router } from "express";
import DB from "./app/DB";
import Config from "./app/Config";

const api = Router();

api.delete("/articles/:id", (req, res) => {
  const { id } = req.params;
  const db = DB.read();
  db["articles"] = db["articles"].filter((article) => article.id != id);
  DB.save(db);
  res.status(201).end();
});

api.get("/highlights", (req, res) => {
  res.json(DB.read()["highlights"]);
});

api.delete("/highlights/:id", (req, res) => {
  const db = DB.read();
  db["highlights"] = db["highlights"].filter(({ id }) => id != req.params.id);
  DB.save(db);
  res.status(201).end();
});

api.get("/articles", (req, res) => {
  res.json(DB.read()["articles"]);
});

api.get("/users", (req, res) => {
  const limit = req.query["limit"] || 15;
  const users = DB.read()["phone"].sort(
    (a, b) =>
      new Date(b.last_date || b.first_date).getTime() -
      new Date(a.last_date || a.first_date).getTime()
  );
  res.json(users.slice(0, limit));
});

api.get("/version", (req, res) => {
  res.json(require("../package.json")["version"]);
});

api.get("/total", (req, res) => {
  const db = DB.read();
  let actions = 0;
  let bans = 0;
  let disables = 0;
  // let disabled = 0;
  db["phone"].map((phone) => {
    actions += parseInt(phone.total_count) || 0;
    bans += Boolean(phone.session.banned) ? 1 : 0;
    disables += Boolean(phone.session.disabled) ? 1 : 0;
  });
  res.json({
    users: db["phone"].length,
    actions,
    disables,
    bans,
  });
});

api.get("/settings", (req, res) => {
  res.json(Config.getAll());
});

api.post("/settings", (req, res) => {
  try {
    Object.entries(req.body).map(([key, value]) => Config.set(key, value));
  } catch (e) {
    return res.status(400).end();
  }
  res.status(201).redirect(req.headers["referer"] || "/settings.html");
});

export default api;
