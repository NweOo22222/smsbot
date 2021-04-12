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
    return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
  });
  res.json(articles);
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

export default api;
