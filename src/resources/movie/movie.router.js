import { Router } from "express";
import { MovieValidator } from "./movie.validator.js";
import { handler, saveParams } from "../../utils/http.util.js";
import { MovieGenreModel, MovieModel } from "../../database/index.js";
import { MovieRepository } from "./movie.repository.js";
import { MovieService } from "./movie.service.js";
import { MovieController } from "./movie.controller.js";
import { PaginationValidator, validate } from "../../utils/validator.util.js";
import { MovieGenreRepository } from "../movie-genre/movie-genre.repository.js";
import { TMDBService } from "../tmdb/tmdb.service.js";
import { LogMiddleware } from "../../middleware/log/index.js";
import { INDEXES } from "../../middleware/log/elasticsearch.js";

const router = Router();

const movieGenreRepository = new MovieGenreRepository(MovieGenreModel);
const tmdbService = new TMDBService();

const repository = new MovieRepository(MovieModel);
const service = new MovieService(repository, {
  repositories: { movieGenreRepository },
  services: { tmdbService },
});
const controller = new MovieController(service);

router.use(
  LogMiddleware.for(INDEXES.MOVIES, {
    identifier: "code",
    methods: ["POST", "PATCH", "DELETE"],
  })
);

router.get(
  "/movies",
  validate(PaginationValidator, MovieValidator.find),
  handler(controller.find.bind(controller))
);

router.get("/movies/:code", handler(controller.findOne.bind(controller)));

router.post(
  "/movies",
  saveParams,
  validate(MovieValidator.create),
  handler(controller.create.bind(controller))
);

router.patch(
  "/movies/:code",
  saveParams,
  validate(MovieValidator.update),
  handler(controller.update.bind(controller))
);

router.delete(
  "/movies/:code",
  saveParams,
  handler(controller.delete.bind(controller))
);

export const MovieRouter = router;
