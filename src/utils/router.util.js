import { Router } from "express";
import { AuthRouter } from "../resources/auth/auth.router.js";
import {
  PreAuthUserRouter,
  UserRouter,
} from "../resources/user/user.router.js";

const router = Router();

router.use(PreAuthUserRouter, AuthRouter, UserRouter);

export const AppRouter = router;
