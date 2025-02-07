import { DataTypes } from "sequelize";
import { sequelize } from "../index.js";

export const UserModel = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      primaryKey: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "users",
    underscored: true,
  }
);
