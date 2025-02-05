import { DataTypes } from "sequelize";
import { sequelize } from "../index.js";

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
    sinopsis: DataTypes.TEXT,
  },
  {
    timestamps: false,
    tableName: "movies",
    underscored: true,
  }
);
