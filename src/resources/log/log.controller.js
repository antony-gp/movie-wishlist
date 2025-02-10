/** @typedef {InstanceType<import('./log.service')['LogService']>} LogService */

export class LogController {
  #service;

  /** @param {LogService} service */
  constructor(service) {
    this.#service = service;
  }

  /** @param {import('express').Request} req */
  async find({ params: { index }, query }) {
    return this.#service.find(index, query);
  }

  /** @param {import('express').Request} req */
  async history({ params: { index, code }, query }) {
    return this.#service.history(index, code, query);
  }
}
