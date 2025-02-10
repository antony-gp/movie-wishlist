/**
 * @param {import("./http.util").Request} request
 * @param {import("./http.util").Response} response
 * @param {import("./http.util").HttpResponse | import("./http.util").HttpError} result
 */
export async function httpLogger(request, response, result) {
  if (!request.logger) return;

  const identifier = request.logger.identifier;

  const id =
    identifier && (response.locals?.[identifier] ?? result.data?.[identifier]);

  const log = {
    identifier: id,
    path: request.path,
    method: request.method,
    requestBody: request.body,
    status: result.status,
    responseBody: result.data ?? result,
  };

  await request.logger.log(log).catch(console.error);
}
