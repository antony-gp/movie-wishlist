/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 * */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("users", {
    email: {
      type: Sequelize.STRING(320),
      allowNull: false,
      primaryKey: true,
    },
    token: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  });
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * */
export async function down(queryInterface) {
  await queryInterface.dropTable("users");
}
