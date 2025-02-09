import { checkSchema } from "express-validator";
import { UnprocessableEntityError } from "./http.util.js";

/** @param {(import("express-validator/lib/middlewares/schema").RunnableValidationChains<import("express-validator").ValidationChain>)[]} schemas  */
export function validate(...schemas) {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} _res
   * @param {import('express').NextFunction} next
   * */
  return async function (req, _res, next) {
    const validationResults = await Promise.all(
      schemas.map((schema) => schema.run(req))
    );

    const errorMessages = validationResults
      .flat(Infinity)
      .map((validation) => validation.array().map(({ msg }) => msg))
      .flat(Infinity)
      .sort();

    next(errorMessages[0] && new UnprocessableEntityError(errorMessages));
  };
}

export const PaginationValidator = checkSchema(
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
    take: {
      optional: true,
      isInt: {
        options: {
          gt: 0,
        },
        errorMessage: "Query param take must be an integer greater than 0.",
      },
    },
  },
  ["query"]
);
