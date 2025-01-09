import express from "express";
import "reflect-metadata";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import { morganLogger } from "./logger";
import ENV from "./env";
import routers from "../routes/index";
import { errorHandler } from "../middlewares/errorHandler";

const app = express();

// Use helmet JS
app.use(helmet());

// Enable CORS
app.use(cors({ origin: "*" }));

// Use body parser to read JSON payloads
app.use(express.json({ limit: "500mb" }));
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "500mb",
  })
);

// Use morgan logger
app.use(morganLogger);

// Register routes
app.use(`${ENV.API_ROOT}/movie`, routers.movieRouter);

// Use error handling middleware
app.use(errorHandler);

export default app;
