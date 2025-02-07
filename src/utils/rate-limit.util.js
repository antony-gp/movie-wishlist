import rateLimit from "express-rate-limit";

export const RateLimit = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS,
  limit: process.env.RATE_LIMIT_PER_WINDOW,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many requests, try again later",
  },
});
