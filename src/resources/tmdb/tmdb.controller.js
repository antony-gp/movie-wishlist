/** @typedef {InstanceType<import('./tmdb.service')['TMDBService']>} TMDBService */

export class TMDBController {
  #service;

  /** @param {TMDBService} service */
  constructor(service) {
    this.#service = service;
  }

  /** @param {import('express').Request} req */
  async search({ params: { title }, query }) {
    return this.#service.search(title, query);
  }
}
