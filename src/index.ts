import { join, dirname } from "path";
import express from "express";
import morgan from "morgan";
import middleware from "./middleware";
import router from "./routes";
import api from "./api";
import { connect } from "./socket";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(middleware);

app.use(router);

app.use("/api", api);

app.use(express.static(join(dirname(__dirname), "static")));

connect(app).listen(PORT, () =>
  console.log("server is running on http://localhost:%d", PORT)
);
