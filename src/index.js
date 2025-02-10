import express from "express";
import helmet from "helmet";
import cors from "cors";
import { RateLimitMiddleware } from "./middleware/rate-limit/index.js";
import { associate, sequelize } from "./database/index.js";
import { AppRouter } from "./utils/router.util.js";
import { errorHandler, handleResourceNotFound } from "./utils/http.util.js";

await sequelize.authenticate().catch(console.error);
await associate().catch(console.error);

const app = express();

app.use(
  helmet(),
  cors(),
  RateLimitMiddleware,
  express.json(),
  AppRouter,
  handleResourceNotFound,
  errorHandler
);

app.listen(process.env.PORT);
