import { Router } from "express";
import { handler } from "../../utils/http.util.js";
import { TMDBService } from "./tmdb.service.js";
import { TMDBController } from "./tmdb.controller.js";
import { validate } from "../../utils/validator.util.js";
import { TMDBValidator } from "./tmdb.validator.js";

const router = Router();

const service = new TMDBService();
const controller = new TMDBController(service);

router.get(
  "/tmdb/:title",
  validate(TMDBValidator.search),
  handler(controller.search.bind(controller))
);

export const TMDBRouter = router;
