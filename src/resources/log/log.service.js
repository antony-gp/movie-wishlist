/** @typedef {InstanceType<import('../../middleware/log/index.js')['LogMiddleware']>} LogMiddleware */

import { LogMiddleware } from "../../middleware/log/index.js";
import {
  createPaginationFilter,
  HttpError,
  PaginatedResponse,
} from "../../utils/http.util.js";

export class LogService {
  #digest(search) {
    return {
      count: search.hits.total.value,
      data: search.hits.hits.map(({ _source }) => _source),
    };
  }

  /**
   * @param {string} index
   * @param {import('express').Request['query']} query
   */
  async find(index, query) {
    const { offset: from, limit: size } = createPaginationFilter(query);

    const search = await LogMiddleware.find({
      index,
      from,
      size,
      sort: {
        _doc: {
          order: "desc",
        },
      },
    });

    const { data, count } = this.#digest(search);

    return new PaginatedResponse(data, query, count);
  }

  /**
   * @param {string} index
   * @param {string} code
   * @param {import('express').Request['query']} query
   */
  async history(index, code, query) {
    const { offset: from, limit: size } = createPaginationFilter(query);

    const search = await LogMiddleware.find({
      index,
      from,
      size,
      sort: {
        _doc: {
          order: "desc",
        },
      },
      query: {
        match: { identifier: code },
      },
    });

    if (search instanceof HttpError) return search;

    const { data, count } = this.#digest(search);

    return new PaginatedResponse(data, query, count);
  }
}
