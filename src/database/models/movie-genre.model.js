import { DataTypes } from "sequelize";
import { sequelize } from "../index.js";

export const MovieGenreModel = sequelize.define(
  "MovieGenre",
  {
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "movies",
        key: "id",
      },
    },
    genreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "genres",
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
