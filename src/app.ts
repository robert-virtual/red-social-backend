import express from "express";
import { __prod__ } from "./constantes";
import authRouter from "./routes/auth";
import postsRouter from "./routes/posts";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
const app = express();

if (!__prod__) {
  dotenv.config();
  app.use(morgan("dev"));
}

const port = process.env.PORT || 3000;
// middlewares
app.use(cors());
app.use(express.json());

app.use("/", authRouter);
app.use("/posts", postsRouter);

app.listen(port, () => console.log("app running on port: " + port));
