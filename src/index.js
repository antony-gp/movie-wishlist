import express from "express";
import helmet from "helmet";
import { RateLimit } from "./utils/rate-limit.util.js";
import { associate, sequelize } from "./database/index.js";
import { AppRouter } from "./utils/router.util.js";
import { errorHandler, handleResourceNotFound } from "./utils/http.util.js";

await sequelize.authenticate().catch(console.error);
await associate().catch(console.error);

const app = express();

app.use(
  helmet(),
  RateLimit,
  express.json(),
  AppRouter,
  handleResourceNotFound,
  errorHandler
);

app.listen(process.env.PORT);
