import { createServer } from "http";
import { join, dirname } from "path";
import express from "express";
import morgan from "morgan";
import middleware from "./middleware";
import router from "./routes";
import { connect } from "./socket";

const PORT = process.env.PORT || 3001;
const app = express();
const server = createServer(app);

connect(server);

app.use(morgan("dev"));

app.use(express.json());

app.use(middleware);

app.use(router);

app.use(express.static(join(dirname(__dirname), "static")));

server.listen(PORT, () =>
  console.log("server is running on http://localhost:%d", PORT)
);
