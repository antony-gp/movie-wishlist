/** @typedef {import('../../database')['MovieModel']} MovieModel */
/** @typedef {import('sequelize').WhereOptions} WhereOptions */
/** @typedef {import('sequelize').Transaction} Transaction */
/** @typedef {import('sequelize').Includeable} Includeable */

import { GenreModel } from "../../database/index.js";

export class MovieRepository {
  #model;

  /** @type {Includeable | Includeable[]} */
  #include;

  /** @param {MovieModel} model */
  constructor(model) {
    this.#model = model;

    this.#include = {
      model: GenreModel,
      association: "genres",
      through: { attributes: [] },
      attributes: ["title"],
    };
  }

  /**
   * @param {WhereOptions} where
   * @param {{ offset: number, limit: number }} options
   * */
  async find(where, { offset, limit }) {
    return this.#model.findAndCountAll({
      where,
      offset,
      limit,
      attributes: { exclude: ["id"] },
      distinct: true,
      include: this.#include,
    });
  }

  /** @param {WhereOptions} where */
  async findOne(where) {
    return this.#model.findOne({ where, include: this.#include });
  }

  async create(body) {
    return this.#model.create(body, {
      fields: [
        "externalCode",
        "code",
        "title",
        "releaseDate",
        "status",
        "synopsis",
      ],
    });
  }

  /** @param {WhereOptions} where */
  async update(body, where) {
    return this.#model.update(body, {
      where,
      fields: ["status", "rating", "recommended"],
    });
  }

  /**
   * @param {WhereOptions} where
   * @param {{ transaction: Transaction }} options\
   * */
  async delete(where, { transaction }) {
    return this.#model.destroy({ where, transaction });
  }
}
