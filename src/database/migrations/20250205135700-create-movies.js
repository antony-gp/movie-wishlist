/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 * */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("movies", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    code: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    release_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("pending", "watched", "rated", "recommended"),
      allowNull: false,
    },
    rating: Sequelize.INTEGER.UNSIGNED,
    recommended: Sequelize.BOOLEAN,
    sinopsis: Sequelize.TEXT,
  });

  await queryInterface.addIndex("movies", ["code"]);
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * */
export async function down(queryInterface) {
  await queryInterface.dropTable("movies");
}
