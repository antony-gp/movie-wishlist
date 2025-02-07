import { describe, it, mock } from "node:test";
import {
  HttpResponse,
  HttpError,
  handler,
  handleResourceNotFound,
  NotFoundError,
  errorHandler,
} from "./http.util.js";
import { deepStrictEqual, strictEqual } from "node:assert";

describe("Http", () => {
  describe("handler", () => {
    const controller = {
      async success() {
        return new HttpResponse(202, { success: true });
      },
      async failure() {
        return new HttpError(406, "Failure.");
      },
      async throwable() {
        throw "error";
      },
    };

    it("(202) Should successfuly send JSON response", async () => {
      const next = mock.fn();

      const status = mock.fn();
      const json = mock.fn();

      status.mock.mockImplementation(() => ({ json }));

      const res = { status };

      await handler(controller.success)(null, res, next);

      strictEqual(next.mock.callCount(), 0);
      strictEqual(status.mock.callCount(), 1);
      strictEqual(status.mock.calls[0].arguments.length, 1);
      deepStrictEqual(status.mock.calls[0].arguments[0], 202);
      strictEqual(json.mock.callCount(), 1);
      strictEqual(json.mock.calls[0].arguments.length, 1);
      deepStrictEqual(json.mock.calls[0].arguments[0], { success: true });
    });

    it("(406) Should fail with header exists message", async () => {
      const next = mock.fn();

      await handler(controller.failure)(null, null, next);

      strictEqual(next.mock.callCount(), 1);
      strictEqual(next.mock.calls[0].arguments.length, 1);
      deepStrictEqual(
        next.mock.calls[0].arguments[0],
        new HttpError(406, "Failure.")
      );
    });

    it("(500) Should fail with header exists message", async () => {
      console.error = mock.fn();

      const next = mock.fn();

      await handler(controller.throwable)(null, null, next);

      strictEqual(console.error.mock.callCount(), 1);
      strictEqual(console.error.mock.calls[0].arguments.length, 1);
      deepStrictEqual(console.error.mock.calls[0].arguments[0], "error");
      strictEqual(next.mock.callCount(), 1);
      strictEqual(next.mock.calls[0].arguments.length, 1);
      deepStrictEqual(
        next.mock.calls[0].arguments[0],
        new HttpError(500, "Internal server error.")
      );
    });
  });

  describe("handleResourceNotFound", () => {
    it("(404) Should return resource not found", () => {
      const next = mock.fn();

      handleResourceNotFound(null, null, next);
      strictEqual(next.mock.callCount(), 1);
      strictEqual(next.mock.calls[0].arguments.length, 1);
      deepStrictEqual(
        next.mock.calls[0].arguments[0],
        new NotFoundError("Resource not found.")
      );
    });
  });

  describe("errorHandler", () => {
    it("(400) Should respond with expected error", () => {
      console.error = mock.fn();

      const status = mock.fn();
      const json = mock.fn();

      status.mock.mockImplementation(() => ({ json }));

      const res = { status };

      errorHandler(new HttpError(), null, res);

      strictEqual(status.mock.callCount(), 1);
      strictEqual(status.mock.calls[0].arguments.length, 1);
      deepStrictEqual(status.mock.calls[0].arguments[0], 400);
      strictEqual(json.mock.callCount(), 1);
      strictEqual(json.mock.calls[0].arguments.length, 1);
      deepStrictEqual(json.mock.calls[0].arguments[0], new HttpError());
    });
    it("(500) Should respond with unexpected error", () => {
      const status = mock.fn();
      const json = mock.fn();

      status.mock.mockImplementation(() => ({ json }));

      const res = { status };

      errorHandler("error", null, res);

      strictEqual(console.error.mock.callCount(), 1);
      strictEqual(console.error.mock.calls[0].arguments.length, 1);
      deepStrictEqual(console.error.mock.calls[0].arguments[0], "error");
      strictEqual(status.mock.callCount(), 1);
      strictEqual(status.mock.calls[0].arguments.length, 1);
      deepStrictEqual(status.mock.calls[0].arguments[0], 500);
      strictEqual(json.mock.callCount(), 1);
      strictEqual(json.mock.calls[0].arguments.length, 1);
      deepStrictEqual(
        json.mock.calls[0].arguments[0],
        new HttpError(500, "Internal server error.")
      );
    });
  });
});
