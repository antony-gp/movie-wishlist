import { checkSchema } from "express-validator";

export const TMDBValidator = {
  search: checkSchema(
    {
      page: {
        optional: true,
        isInt: {
          options: {
            gt: 0,
          },
          errorMessage: "Query param page must be an integer greater than 0.",
        },
      },
    },
    ["query"]
  ),
};
