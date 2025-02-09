import { Sequelize } from "sequelize";

const { MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD } =
  process.env;

export const sequelize = new Sequelize(
  `mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}`
);

export async function associate() {
  (await import("./models/genre.model.js")).associate();
  (await import("./models/movie.model.js")).associate();
}
