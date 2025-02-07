/** @typedef {InstanceType<import('./auth.repository')['AuthRepository']>} AuthRepository */

import { SuccessResponse, UnauthorizedError } from "../../utils/http.util.js";

export class AuthService {
  #repository;

  /** @param {AuthRepository} repository */
  constructor(repository) {
    this.#repository = repository;
  }

  /** @param {`Basic {string}`} basicToken */
  async auth(basicToken) {
    const token = basicToken.slice(6);

    const user = await this.#repository.findOne({ token });

    if (!user) return new UnauthorizedError("Token not authorized.");

    return { email: user.email };
  }

  /** @param {{ email: string, password: string }} body  */
  async token({ email, password }) {
    const token = Buffer.from(`${email}:${password}`).toString("base64");

    const user = await this.#repository.findOne({ token });

    if (!user) return new UnauthorizedError("Invalid credentials.");

    return new SuccessResponse({ token });
  }
}
