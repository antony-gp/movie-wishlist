import { DataTypes } from "sequelize";
import { GenreModel, MovieModel, sequelize } from "../index.js";

export const MovieGenreModel = sequelize.define(
  "MovieGenre",
  {
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: MovieModel,
        key: "id",
      },
    },
    genreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: GenreModel,
        key: "id",
      },
    },
  },
  {
    timestamps: false,
    tableName: "movies_genres",
    underscored: true,
  }
);
