/** @typedef {InstanceType<import('./movie.repository.js')['MovieRepository']>} MovieRepository */
/** @typedef {InstanceType<import('../tmdb/tmdb.service.js')['TMDBService']>} TMDBService */
/** @typedef {InstanceType<import('../movie-genre/movie-genre.repository.js')['MovieGenreRepository']>} MovieGenreRepository */

import { randomUUID } from "node:crypto";
import {
  ConflictError,
  CreatedResponse,
  createPaginationFilter,
  ForbiddenError,
  HttpError,
  NoContentResponse,
  NotFoundError,
  PaginatedResponse,
  SuccessResponse,
} from "../../utils/http.util.js";
import { sequelize } from "../../database/sequelize.js";

/** @type {{ PENDING: "pending", WATCHED: "watched", RATED: "rated", RECOMMENDED: "recommended" }} */
const STATUS = {
  PENDING: "pending",
  WATCHED: "watched",
  RATED: "rated",
  RECOMMENDED: "recommended",
};

export class MovieService {
  #repository;
  #tmdbService;
  #movieGenreRepository;

  /**
   * @param {MovieRepository} repository
   * @param {{ services: { tmdbService: TMDBService }, repositories: { movieGenreRepository: MovieGenreRepository } }} dependencies
   */
  constructor(
    repository,
    { services: { tmdbService }, repositories: { movieGenreRepository } }
  ) {
    this.#repository = repository;
    this.#tmdbService = tmdbService;
    this.#movieGenreRepository = movieGenreRepository;
  }

  async find(userEmail, query) {
    const filter = createPaginationFilter(query);

    const where = {
      userEmail,
      ...(query.status && { status: query.status }),
    };

    const { count, rows } = await this.#repository.find(where, filter);

    return new PaginatedResponse(rows.map(this.#parse), query, count);
  }

  /** @param {string} code  */
  async findOne(userEmail, code) {
    const movie = await this.#repository.findOne({ userEmail, code });

    if (!movie)
      return new NotFoundError(`Movie with code ${code} was not found.`);

    return new SuccessResponse(this.#parse(movie));
  }

  /** @param {{ tmdbId: string }} body  */
  async create(userEmail, { tmdbId }) {
    const response = await this.#tmdbService.request(`/movie/${tmdbId}`);

    if (response instanceof HttpError) return response;

    const {
      genres,
      title,
      release_date: releaseDate,
      overview: synopsis,
    } = response;

    const movie = await this.#repository.findOne({ externalCode: tmdbId });

    if (movie)
      return new ConflictError(`Movie with tmdbId ${tmdbId} already exists.`);

    const code = randomUUID();

    const { id: movieId } = await this.#repository.create({
      userEmail,
      externalCode: tmdbId,
      code,
      title,
      releaseDate,
      status: STATUS.PENDING,
      synopsis,
    });

    await Promise.all(
      genres.map(({ id: genreId }) =>
        this.#movieGenreRepository.create({ movieId, genreId })
      )
    );

    return new CreatedResponse({ code });
  }

  /**
   * @param {string} email
   * @param {{ status?: Exclude<STATUS[keyof STATUS], 'pending'>, rating?: number, recommended?: boolean }} body
   * */
  async update(userEmail, code, body) {
    const movie = await this.#repository.findOne({ userEmail, code });

    if (!movie)
      return new NotFoundError(`Movie with code ${code} was not found.`);

    const updateError = this.#validateUpdate(movie, body);

    if (updateError) return updateError;

    await this.#repository.update(body, { id: movie.id });

    return new SuccessResponse({ code });
  }

  /** @param {string} code */
  async delete(userEmail, code) {
    const { id: movieId } =
      (await this.#repository.findOne({ userEmail, code })) || {};

    if (!movieId)
      return new NotFoundError(`Movie with code ${code} was not found.`);

    await sequelize.transaction(async (transaction) => {
      await this.#movieGenreRepository.delete({ movieId }, { transaction });
      await this.#repository.delete({ code }, { transaction });
    });

    return new NoContentResponse();
  }

  /** @param {import('sequelize').Model} row  */
  #parse(row) {
    const data = row.toJSON();

    data.id && delete data.id;
    data.userEmail && delete data.userEmail;

    data.genres = data.genres.map(({ title }) => title);

    return data;
  }

  /**
   * @param {{ status?: Exclude<STATUS[keyof STATUS], 'pending'>, rating?: number, recommended?: boolean }} current
   * @param {{ status?: Exclude<STATUS[keyof STATUS], 'pending'>, rating?: number, recommended?: boolean }} body
   *
   * @returns {ForbiddenError | void}
   */
  #validateUpdate(current, body) {
    if ("status" in body) {
      const statusArray = Object.values(STATUS);

      const currentIndex = statusArray.indexOf(current.status);
      const newIndex = statusArray.indexOf(body.status);

      if (currentIndex === statusArray.length - 1)
        return new ForbiddenError(
          "Field status cannot be updated. Current movie is already at last status (recommended)."
        );

      if (currentIndex !== newIndex - 1)
        return new ForbiddenError(
          `Field status cannot be updated. Current movie can only be updated to ${
            statusArray[currentIndex + 1]
          } status.`
        );
    }

    const status = body.status ?? current.status;

    if ("rating" in body && !["rated", "recommended"].includes(status))
      return new ForbiddenError(
        "Field rating cannot be updated. Current movie has yet to be rated."
      );

    if ("recommended" in body && status !== "recommended")
      return new ForbiddenError(
        "Field recommended cannot be updated. Current movie has yet to be recommended."
      );
  }
}
