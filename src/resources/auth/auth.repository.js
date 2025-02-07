/** @typedef {import('../../database')['UserModel']} UserModel */
/** @typedef {import('sequelize').WhereOptions} WhereOptions */

export class AuthRepository {
  #model;

  /** @param {UserModel} model */
  constructor(model) {
    this.#model = model;
  }

  /** @param {WhereOptions} where */
  async findOne(where) {
    return this.#model.findOne({ where });
  }
}
