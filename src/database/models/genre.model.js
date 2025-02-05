import { DataTypes } from "sequelize";
import { sequelize } from "../index.js";

export const GenreModel = sequelize.define(
  "Genre",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "genres",
    underscored: true,
  }
);
