/** @typedef {InstanceType<import('./user.repository.js')['UserRepository']>} UserRepository */

import {
  ConflictError,
  CreatedResponse,
  NoContentResponse,
  SuccessResponse,
} from "../../utils/http.util.js";

export class UserService {
  #repository;

  /** @param {UserRepository} repository */
  constructor(repository) {
    this.#repository = repository;
  }

  /** @param {{ email: string, password: string }} body  */
  async create({ email, password }) {
    const user = await this.#repository.findOne({ email });

    if (user)
      return new ConflictError(`User with email ${email} already exists.`);

    const token = Buffer.from(`${email}:${password}`).toString("base64");

    await this.#repository.create({ email, token });

    return new CreatedResponse({ token });
  }

  /**
   * @param {string} email
   * @param {{ password: string }} body
   * */
  async update(email, { password }) {
    const token = Buffer.from(`${email}:${password}`).toString("base64");

    await this.#repository.update({ token }, { email });

    return new SuccessResponse({ token });
  }

  /** @param {string} email */
  async delete(email) {
    await this.#repository.delete({ email });

    return new NoContentResponse();
  }
}
