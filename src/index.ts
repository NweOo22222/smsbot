import { join, dirname } from "path";
import { connect } from "./socket";
import express from "express";
import morgan from "morgan";
import router from "./routes";
import api from "./api";
import DB from "./app/DB";
import Config from "./app/Config";
import analytic from "./analytic";

const PORT = process.env.PORT || 3001;
const app = express();

DB.init();
Config.init();

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(analytic);

app.use("/api", api);

app.use(router);

app.use(express.static(join(dirname(__dirname), "static")));

connect(app).listen(PORT, () =>
  console.log("server is running on http://localhost:%d", PORT)
);
