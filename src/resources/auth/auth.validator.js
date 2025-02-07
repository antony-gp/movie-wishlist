import { checkSchema } from "express-validator";

export const AuthValidator = {
  auth: checkSchema(
    {
      authorization: {
        exists: {
          errorMessage: "Header Authorization must exist.",
        },
        notEmpty: {
          errorMessage: "Header Authorization must not be empty.",
        },
        matches: {
          options: /Basic .+/,
          errorMessage:
            "Header Authorization must have it's token preceded by the keyword 'Basic'.",
        },
      },
    },
    ["headers"]
  ),
  "request-token": checkSchema(
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
        notEmpty: {
          errorMessage: "Field password must not be empty.",
        },
        isString: {
          errorMessage: "Field password must be a string.",
        },
      },
    },
    ["body"]
  ),
};
