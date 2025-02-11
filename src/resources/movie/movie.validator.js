import { checkSchema } from "express-validator";

export const MovieValidator = {
  find: checkSchema(
    {
      status: {
        optional: true,
        isIn: {
          options: [["pending", "watched", "rated", "recommended"]],
          get errorMessage() {
            const formatter = new Intl.ListFormat("en", {
              style: "short",
              type: "disjunction",
            });

            return `Query param status must be ${formatter.format(
              this.options[0]
            )}.`;
          },
        },
      },
    },
    ["query"]
  ),
  create: checkSchema(
    {
      tmdbId: {
        exists: {
          errorMessage: "Field tmdbId must exist.",
        },
        isString: {
          errorMessage: "Field tmdbId must be a string.",
        },
        isNumeric: {
          options: {
            no_symbols: true,
          },
          errorMessage: "Field tmdbId must contain only numeric values.",
        },
      },
    },
    ["body"]
  ),
  update: checkSchema(
    {
      status: {
        optional: true,
        isIn: {
          options: [["watched", "rated", "recommended"]],
          get errorMessage() {
            const formatter = new Intl.ListFormat("en", {
              style: "short",
              type: "disjunction",
            });

            return `Field status must be ${formatter.format(this.options[0])}.`;
          },
        },
      },
      rating: {
        exists: {
          if: (_, { req }) =>
            "rating" in req.body || req.body.status === "rated",
          errorMessage: "Field rating must exist.",
        },
        isInt: {
          options: {
            min: 0,
            max: 5,
          },
          errorMessage: "Field rating must be an integer ranging from 0 to 5.",
        },
      },
      recommended: {
        exists: {
          if: (_, { req }) =>
            "recommended" in req.body || req.body.status === "recommended",
          errorMessage: "Field recommended must exist.",
        },
        isBoolean: {
          options: {
            strict: true,
          },
          errorMessage: "Field recommended must be a boolean.",
        },
      },
    },
    ["body"]
  ),
};
