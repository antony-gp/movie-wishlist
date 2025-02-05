/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 * */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("movies_genres", {
    movie_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "movies",
        key: "id",
      },
    },
    genre_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "genres",
        key: "id",
      },
    },
  });
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * */
export async function down(queryInterface) {
  await queryInterface.dropTable("movies_genres");
}
