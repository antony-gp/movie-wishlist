/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 * */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("genres", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
  });
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * */
export async function down(queryInterface) {
  await queryInterface.dropTable("genres");
}
