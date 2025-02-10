import { Router } from "express";
import { handler } from "../../utils/http.util.js";
import { LogService } from "./log.service.js";
import { LogController } from "./log.controller.js";
import { PaginationValidator, validate } from "../../utils/validator.util.js";

const router = Router();

const service = new LogService();
const controller = new LogController(service);

router.get(
  "/logs/:index",
  validate(PaginationValidator),
  handler(controller.find.bind(controller))
);

router.get(
  "/logs/:index/history/:code",
  validate(PaginationValidator),
  handler(controller.history.bind(controller))
);

export const LogRouter = router;
