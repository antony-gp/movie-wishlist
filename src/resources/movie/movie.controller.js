/** @typedef {InstanceType<import('./movie.service')['MovieService']>} MovieService */
/** @typedef {import('express').Request & { user: string }} Request */

export class MovieController {
  #service;

  /** @param {MovieService} service */
  constructor(service) {
    this.#service = service;
  }

  /** @param {Request} req */
  async find({ user, query }) {
    return this.#service.find(user, query);
  }

  /** @param {Request} req */
  async findOne({ user, params: { code } }) {
    return this.#service.findOne(user, code);
  }

  /** @param {Request} req */
  async create({ user, body }) {
    return this.#service.create(user, body);
  }

  /** @param {Request} req */
  async update({ user, params: { code }, body }) {
    return this.#service.update(user, code, body);
  }

  /** @param {Request} req */
  async delete({ user, params: { code } }) {
    return this.#service.delete(user, code);
  }
}
