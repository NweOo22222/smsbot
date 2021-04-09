const { writeFileSync } = require("fs");

const result = {
  phone: [],
  articles: [],
};

const db = require("./.db.json");
const phone = db["phone"];
const articles = db["articles"];

require("./articles.json").forEach((article) => {
  result.articles.push(article);
});

Object.values(articles).forEach((article) => {
  result.articles.push(article);
});

Object.entries(phone).forEach(([id, data]) => {
  result.phone.push({ id, ...data });
});

console.log(db);
