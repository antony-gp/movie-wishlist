/** @typedef {InstanceType<import('./auth.service')['AuthService']>} AuthService */

import { UnauthorizedError } from "../../utils/http.util.js";

export class AuthController {
  #service;

  /** @param {AuthService} service */
  constructor(service) {
    this.#service = service;
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * */
  async auth(req, _res, next) {
    const authorization = await this.#service.auth(req.headers.authorization);

    if (authorization instanceof UnauthorizedError) return next(authorization);

    req.user = authorization.email;

    next();
  }

  /** @param {import('express').Request} req */
  async token({ body }) {
    return this.#service.token(body);
  }
}
