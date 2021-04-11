import { Router } from "express";
import DB from "./app/DB";

const api = Router();
// const per_page = 30;

api.delete("/articles/:id", (req, res) => {
  const { id } = req.params;
  const db = DB.read();
  db["articles"] = db["articles"].filter((article) => article.id != id);
  DB.save(db);
  res.status(201).end();
});

api.get("/articles", (req, res) => {
  const articles = DB.read()["articles"].sort((a, b) => {
    return new Date(a.datetime) > new Date(b.datetime);
  });
  res.json(articles);
});

api.get("/users", (req, res) => {
  const users = DB.read()["phone"].sort((a, b) => {
    return new Date(a.datetime) > new Date(b.datetime);
  });
  res.json(users);
});

api.get("/version", (req, res) => {
  res.json(require("../package.json")["version"]);
});

export default api;
