/** @typedef {'GET' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'PUT' | 'DELETE' | 'POST' | 'PATCH' | 'CONNECT'} HttpMethods */
/** @typedef {Exclude<Parameters<InstanceType<import('@elastic/elasticsearch').Client>['search']>[0], undefined>} ElasticSearchOptions */

import { handleUnexpectedException, HttpError } from "../../utils/http.util.js";
import { elasticClient } from "./elasticsearch.js";

export class LogMiddleware {
  #index;

  /**
   * @param {string} index
   * @param {string | undefined} identifier
   * */
  constructor(index, identifier) {
    this.#index = index;
    this.identifier = identifier;
  }

  /**
   * @param {string} index
   * @param {{ identifier?: string, methods?: HttpMethods[] }} options
   */
  static for(index, { identifier, methods } = {}) {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} _res
     * @param {import('express').NextFunction} next
     */
    return function (req, _res, next) {
      if (!methods || methods.includes(req.method.toUpperCase()))
        req.logger = new LogMiddleware(index, identifier);

      next();
    };
  }

  /**
   * @param {ElasticSearchOptions} options
   */
  static async find(options) {
    const search = await elasticClient.search(options).catch((error) => error);

    if (search?.name === "ResponseError") {
      const status = search.meta.statusCode;

      if (status >= 500) return handleUnexpectedException(search);

      return new HttpError(status, search.meta.body.error.reason);
    }

    return search;
  }

  /** @param {Record<string, any>} body */
  async log(body) {
    await elasticClient.index({ index: this.#index, document: body });
  }
}
