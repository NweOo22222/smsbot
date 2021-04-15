import { Router } from "express";
import DB from "./app/DB";
import Config from "./app/Config";

const api = Router();
// const per_page = 30;

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
  const users = DB.read()["phone"].sort((a, b) => {
    return (
      new Date(a.session["expired"]).getTime() -
      new Date(b.session["expired"]).getTime()
    );
  });
  res.json(users.reverse().slice(0, limit));
});

api.get("/version", (req, res) => {
  res.json(require("../package.json")["version"]);
});

api.get("/settings", (req, res) => {
  res.json(Config.read());
});

api.post("/settings", (req, res) => {
  const db = Config.read();
  Object.entries(req.body).forEach(([id, value]) => {
    db[id] = value;
  });
  Config.save(db);
  res.status(201).redirect(req.headers["referer"] || "/settings.html");
});

export default api;
