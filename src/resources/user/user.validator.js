import { checkSchema } from "express-validator";

export const UserValidator = {
  create: checkSchema(
    {
      email: {
        exists: {
          errorMessage: "Field email must exist.",
        },
        notEmpty: {
          errorMessage: "Field email must not be empty.",
        },
        isEmail: {
          errorMessage: "Field email must be a valid email.",
        },
      },
      password: {
        exists: {
          errorMessage: "Field password must exist.",
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1,
          },
          errorMessage:
            "Field password must have at least 8 characters and contain at least 1 lowercase, uppercase, number and symbol.",
        },
      },
    },
    ["body"]
  ),
  update: checkSchema(
    {
      password: {
        optional: true,
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1,
          },
          errorMessage:
            "Field password must have at least 8 characters and contain at least 1 lowercase, uppercase, number and symbol.",
        },
      },
    },
    ["body"]
  ),
};
