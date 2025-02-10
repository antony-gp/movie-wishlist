import rateLimit from "express-rate-limit";

export const RateLimitMiddleware = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS,
  limit: process.env.RATE_LIMIT_PER_WINDOW,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests, try again later.",
  },
});
