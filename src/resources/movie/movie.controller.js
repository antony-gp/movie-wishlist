/** @typedef {InstanceType<import('./movie.service')['MovieService']>} MovieService */

export class MovieController {
  #service;

  /** @param {MovieService} service */
  constructor(service) {
    this.#service = service;
  }

  /** @param {import('express').Request} req */
  async find({ query }) {
    return this.#service.find(query);
  }

  /** @param {import('express').Request} req */
  async findOne({ params: { code } }) {
    return this.#service.findOne(code);
  }

  /** @param {import('express').Request} req */
  async create({ body }) {
    return this.#service.create(body);
  }

  /** @param {import('express').Request} req */
  async update({ params: { code }, body }) {
    return this.#service.update(code, body);
  }

  /** @param {import('express').Request} req */
  async delete({ params: { code } }) {
    return this.#service.delete(code);
  }
}
