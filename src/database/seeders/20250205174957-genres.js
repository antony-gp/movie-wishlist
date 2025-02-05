/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * */
export async function up(queryInterface) {
  try {
    const response = await fetch(`${process.env.TMDB_URL}/genre/movie/list`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!response.ok) throw data;

    const genres = data.genres.map(({ id, name: title }) => ({ id, title }));

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
