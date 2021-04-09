import express from "express";
import morgan from "morgan";
import middleware from "./middleware";
import router from "./routes";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(middleware);

app.use(router);

app.listen(PORT, () =>
  console.log("server is running on http://localhost:%d", PORT)
);
