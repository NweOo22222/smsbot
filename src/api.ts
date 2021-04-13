import { Router } from "express";
import { MAX_CHARACTER_COUNT, MAX_TOTAL_ACTION } from "./settings";
import DB from "./app/DB";
import Headline from "./app/Headline";

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
  res.json({
    MAX_CHARACTER_COUNT,
    MAX_TOTAL_ACTION,
  });
});

export default api;
