import { DataTypes } from "sequelize";
import { GenreModel, MovieGenreModel, sequelize } from "../index.js";

export const MovieModel = sequelize.define(
  "Movie",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    code: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    externalCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    releaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "watched", "rated", "recommended"),
      allowNull: false,
    },
    rating: DataTypes.INTEGER.UNSIGNED,
    recommended: DataTypes.BOOLEAN,
    synopsis: DataTypes.TEXT,
  },
  {
    timestamps: false,
    tableName: "movies",
    underscored: true,
  }
);

export function associate() {
  MovieModel.belongsToMany(GenreModel, {
    through: MovieGenreModel,
    as: "genres",
    foreignKey: "movieId",
  });
}
