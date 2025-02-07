import { Router } from "express";
import { UserValidator } from "./user.validator.js";
import { handler } from "../../utils/http.util.js";
import { UserModel } from "../../database/index.js";
import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";
import { validate } from "../../utils/validator.util.js";

const router = Router();
const preAuthRouter = Router();

const repository = new UserRepository(UserModel);
const service = new UserService(repository);
const controller = new UserController(service);

preAuthRouter.post(
  "/users",
  validate(UserValidator.create),
  handler(controller.create.bind(controller))
);

router.patch(
  "/users",
  validate(UserValidator.update),
  handler(controller.update.bind(controller))
);

router.delete("/users", handler(controller.delete.bind(controller)));

export const PreAuthUserRouter = preAuthRouter;
export const UserRouter = router;
