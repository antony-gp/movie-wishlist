/** @typedef {[import('express').Request, import('express').Response, import('express').NextFunction]} ExpressHandlerParams */

/**
 * @param {(...[req, res, next]: ExpressHandlerParams) => Promise<HttpResponse | HttpError>} controllerHandler
 * */
export function handler(controllerHandler) {
  /**
   * @param {ExpressHandlerParams[0]} req
   * @param {ExpressHandlerParams[1]} res
   * @param {ExpressHandlerParams[2]} next
   * */
  return async function (req, res, next) {
    const response = await controllerHandler(req, res, next).catch(
      handleUnexpectedException
    );

    if (response instanceof HttpError) return next(response);

    res.status(response.status).json(response.data);
  };
}

function handleUnexpectedException(error) {
  console.error(error);
  return new HttpError(500, "Internal server error.");
}

function handleJsonParseException() {
  return new UnprocessableEntityError("Invalid JSON body.");
}

export function handleResourceNotFound(_req, _res, next) {
  next(new NotFoundError("Resource not found."));
}

/**
 * @param {HttpError | Error} error
 * @param {ExpressHandlerParams[0]} _req
 * @param {ExpressHandlerParams[1]} res
 * @param {ExpressHandlerParams[2]} _next
 * */
export function errorHandler(error, _req, res, _next) {
  if (error instanceof HttpError) return res.status(error.status).json(error);

  if (error?.type === "entity.parse.failed")
    return res.status(422).json(handleJsonParseException());

  res.status(500).json(handleUnexpectedException(error));
}

/** @param {import('express').Request['query']} query */
export function createPaginationFilter(query) {
  const page = +query.page || 1;
  const limit = +query.take || 10;

  return {
    offset: (page - 1) * limit,
    limit,
  };
}

export class HttpResponse {
  constructor(status = 200, data) {
    this.status = status;
    this.data = data;
  }
}

export class SuccessResponse extends HttpResponse {
  constructor(data = {}) {
    super(undefined, data);
  }
}

export class PaginatedResponse extends SuccessResponse {
  constructor(data = [], query = {}, count = 0) {
    const page = +query.page || 1;
    const perPageLimit = +query.take || 10;

    const pageCount = ~~((count - 1) / perPageLimit) + 1;

    super({
      page,
      pageCount,
      perPageLimit,
      totalItems: count,
      data,
    });
  }
}

export class CreatedResponse extends HttpResponse {
  constructor(data = {}) {
    super(201, data);
  }
}

export class NoContentResponse extends HttpResponse {
  constructor() {
    super(204);
  }
}

export class HttpError {
  /** @param {string | string[]} message  */
  constructor(status = 400, message = "Something went wrong.") {
    this.status = status;
    this.message = message;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized.") {
    super(401, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden.") {
    super(403, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not found.") {
    super(404, message);
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message = "Unprocessable entity.") {
    super(422, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Conflict.") {
    super(409, message);
  }
}
