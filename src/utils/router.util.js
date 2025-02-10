import { Router } from "express";
import { AuthRouter } from "../resources/auth/auth.router.js";
import {
  PreAuthUserRouter,
  UserRouter,
} from "../resources/user/user.router.js";
import { MovieRouter } from "../resources/movie/movie.router.js";
import { TMDBRouter } from "../resources/tmdb/tmdb.router.js";
import { LogRouter } from "../resources/log/log.router.js";

const router = Router();

router.use(
  "/v1",
  PreAuthUserRouter,
  AuthRouter,
  UserRouter,
  MovieRouter,
  TMDBRouter,
  LogRouter
);

export const AppRouter = router;
