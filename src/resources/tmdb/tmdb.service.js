import { HttpError, PaginatedResponse } from "../../utils/http.util.js";

export class TMDBService {
  async request(path = "/", { log = true } = {}) {
    const response = await fetch(`${process.env.TMDB_URL}${path}`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    });

    /** @type {Record<string, any>} */
    const data = await response.json();

    if (!response.ok) {
      log && console.error(data);

      return new HttpError(
        response.status,
        data?.status_message,
        "Request to The Movie Database has not succeeded."
      );
    }

    return data;
  }

  /**
   * @param {string} title
   * @param {import('express').Request['query']} query
   * */
  async search(title, query) {
    const response = await this.request(
      `/search/movie?query=${encodeURI(title)}&page=${+query.page || 1}`
    );

    if (response instanceof HttpError) return response;

    const { page, total_results: count, results } = response;

    return new PaginatedResponse(results, { page, take: 20 }, count);
  }
}
