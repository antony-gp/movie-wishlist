/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 * */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING(320),
      allowNull: false,
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
