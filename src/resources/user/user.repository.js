/** @typedef {import('../../database')['UserModel']} UserModel */
/** @typedef {import('sequelize').WhereOptions} WhereOptions */

export class UserRepository {
  #model;

  /** @param {UserModel} model */
  constructor(model) {
    this.#model = model;
  }

  /** @param {WhereOptions} where */
  async findOne(where) {
    return this.#model.findOne({ where });
  }

  async create(body) {
    return this.#model.create(body, { fields: ["email", "token"] });
  }

  /** @param {WhereOptions} where */
  async update(body, where) {
    return this.#model.update(body, { where, fields: ["token"] });
  }

  /** @param {WhereOptions} where */
  async delete(where) {
    return this.#model.destroy({ where });
  }
}
