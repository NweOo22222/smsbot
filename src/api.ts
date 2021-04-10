import { Router } from "express";
import DB from "./app/DB";

const api = Router();
// const per_page = 30;

api.get("/articles", (req, res) => {
  const articles = DB.read()["articles"].sort((a, b) => {
    return new Date(b.datetime) > new Date(a.datetime);
  });
  res.json(articles.reverse());
});

api.get("/users", (req, res) => {
  const users = DB.read()["phone"].sort((a, b) => {
    return new Date(b.datetime) > new Date(a.datetime);
  });
  res.json({
    data: users,
  });
});

export default api;
