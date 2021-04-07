import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import file from "express-fileupload";
import router from "./routes";

config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(file());

app.use(router);

app.listen(PORT, () =>
  console.log("server is running on http://localhost:%d", PORT)
);
