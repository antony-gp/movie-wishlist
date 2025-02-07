import { Router } from "express";
import { AuthValidator } from "./auth.validator.js";
import { handler } from "../../utils/http.util.js";
import { UserModel } from "../../database/index.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../utils/validator.util.js";

const router = Router();

const repository = new AuthRepository(UserModel);
const service = new AuthService(repository);
const controller = new AuthController(service);

router.post(
  "/auth/request-token",
  validate(AuthValidator["request-token"]),
  handler(controller.token.bind(controller))
);

router.use(validate(AuthValidator.auth), controller.auth.bind(controller));

export const AuthRouter = router;
