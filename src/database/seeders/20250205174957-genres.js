import { TMDBService } from "../../resources/tmdb/tmdb.service.js";
import { HttpError } from "../../utils/http.util.js";

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * */
export async function up(queryInterface) {
  try {
    const tmdbService = new TMDBService();

    const response = await tmdbService.request("/genre/movie/list");

    if (response instanceof HttpError) return;

    const genres = response.genres.map(({ id, name: title }) => ({
      id,
      title,
    }));

    await queryInterface.bulkInsert("genres", genres);
  } catch (error) {
    console.error(error);
  }
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * */
export async function down(queryInterface) {
  await queryInterface.bulkDelete("genres", null, {});
}
