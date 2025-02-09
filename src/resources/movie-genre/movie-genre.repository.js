/** @typedef {import('../../database')['MovieGenreModel']} MovieGenreModel */

export class MovieGenreRepository {
  #model;

  /** @param {MovieModel} model */
  constructor(model) {
    this.#model = model;
  }

  async create(body) {
    return this.#model.create(body, { fields: ["movieId", "genreId"] });
  }

  /**
   * @param {WhereOptions} where
   * @param {{ transaction: Transaction }} options\
   * */
  async delete(where, { transaction }) {
    return this.#model.destroy({ where, transaction });
  }
}
