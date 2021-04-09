import { Router } from "express";
import DB from "./app/DB";

const api = Router();

api.get("/articles", (req, res) => {
  const per_page = 30;
  const page = Number(req.query.page) || 1;
  res.json(DB.read()["articles"].slice(page - 1, page * per_page));
});

api.get("/users", (req, res) => {
  const per_page = 20;
  const users = DB.read()["phone"];
  const page = Number(req.query.page) || 1;
  res.json({
    size: users.length,
    data: users.slice(page - 1, page * per_page),
  });
});

export default api;
