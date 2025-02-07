import { UnprocessableEntityError } from "./http.util.js";

/** @param {import("express-validator/lib/middlewares/schema").RunnableValidationChains<import("express-validator").ValidationChain>} schema  */
export function validate(schema) {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} _res
   * @param {import('express').NextFunction} next
   * */
  return async function (req, _res, next) {
    const validationResults = await schema.run(req);

    const errorMessages = validationResults
      .map((validation) => validation.array().map(({ msg }) => msg))
      .flat(Infinity)
      .sort();

    next(errorMessages[0] && new UnprocessableEntityError(errorMessages));
  };
}
