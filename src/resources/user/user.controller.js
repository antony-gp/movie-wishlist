/** @typedef {InstanceType<import('./user.service')['UserService']>} UserService */

export class UserController {
  #service;

  /** @param {UserService} service */
  constructor(service) {
    this.#service = service;
  }

  /** @param {import('express').Request} req */
  async create({ body }) {
    return this.#service.create(body);
  }

  /** @param {import('express').Request} req */
  async update({ user, body }) {
    return this.#service.update(user, body);
  }

  /** @param {import('express').Request} req */
  async delete({ user }) {
    return this.#service.delete(user);
  }
}
