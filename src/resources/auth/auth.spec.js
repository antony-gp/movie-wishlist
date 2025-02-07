import { beforeEach, describe, it, mock } from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import { validate } from "../../utils/validator.util.js";
import { AuthValidator } from "./auth.validator.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { SuccessResponse, UnauthorizedError } from "../../utils/http.util.js";

describe("Auth", () => {
  describe("Validation", () => {
    describe("auth", () => {
      const validateFn = validate(AuthValidator.auth);

      const generateReq = (authorization) => ({
        headers: {
          authorization,
        },
      });

      it("(200) Should pass with valid header", async () => {
        const token = "Basic 123";

        const next = mock.fn();
        const req = generateReq(token);

        await validateFn(req, null, next);

        strictEqual(next.mock.callCount(), 1);
        deepStrictEqual(next.mock.calls[0].arguments, [undefined]);
      });

      it("(422) Should fail with header exists message", async () => {
        const next = mock.fn();
        const req = generateReq();

        await validateFn(req, null, next);

        strictEqual(next.mock.callCount(), 1);
        strictEqual(next.mock.calls[0].arguments.length, 1);

        const errorObject = next.mock.calls[0].arguments[0];
        const message = "Header Authorization must exist.";

        strictEqual(errorObject.status, 422);
        strictEqual(
          errorObject.message.includes(message),
          true,
          `Validation return should contain '${message}'`
        );
      });

      it("(422) Should fail with header not empty message", async () => {
        const token = "";

        const next = mock.fn();
        const req = generateReq(token);

        await validateFn(req, null, next);

        strictEqual(next.mock.callCount(), 1);
        strictEqual(next.mock.calls[0].arguments.length, 1);

        const errorObject = next.mock.calls[0].arguments[0];
        const message = "Header Authorization must not be empty.";

        strictEqual(errorObject.status, 422);
        strictEqual(
          errorObject.message.includes(message),
          true,
          `Validation return should contain '${message}'`
        );
      });

      it("(422) Should fail with header matches pattern message", async () => {
        const token = "123";

        const next = mock.fn();
        const req = generateReq(token);

        await validateFn(req, null, next);

        strictEqual(next.mock.callCount(), 1);
        strictEqual(next.mock.calls[0].arguments.length, 1);

        const errorObject = next.mock.calls[0].arguments[0];
        const message =
          "Header Authorization must have it's token preceded by the keyword 'Basic'.";

        strictEqual(errorObject.status, 422);
        strictEqual(
          errorObject.message.includes(message),
          true,
          `Validation return should contain '${message}'`
        );
      });
    });
    describe("request-token", () => {
      const validateFn = validate(AuthValidator["request-token"]);

      const generateReq = ({ email, password } = {}) => ({
        body: { email, password },
      });

      it("(200) Should pass with valid body", async () => {
        const email = "abc@def.com";
        const password = "AbCd1@3$";

        const next = mock.fn();
        const req = generateReq({ email, password });

        await validateFn(req, null, next);

        strictEqual(next.mock.callCount(), 1);
        deepStrictEqual(next.mock.calls[0].arguments, [undefined]);
      });

      it("(422) Should fail with field exists message", async () => {
        const next = mock.fn();
        const req = generateReq();

        await validateFn(req, null, next);

        strictEqual(next.mock.callCount(), 1);
        strictEqual(next.mock.calls[0].arguments.length, 1);

        const errorObject = next.mock.calls[0].arguments[0];
        const messages = [
          "Field email must exist.",
          "Field password must exist.",
        ];

        strictEqual(errorObject.status, 422);
        messages.forEach((message) => {
          strictEqual(
            errorObject.message.includes(message),
            true,
            `Validation return should contain '${message}'`
          );
        });
      });

      it("(422) Should fail with field not empty message", async () => {
        const email = "";
        const password = "";

        const next = mock.fn();
        const req = generateReq({ email, password });

        await validateFn(req, null, next);

        strictEqual(next.mock.callCount(), 1);
        strictEqual(next.mock.calls[0].arguments.length, 1);

        const errorObject = next.mock.calls[0].arguments[0];
        const messages = [
          "Field email must not be empty.",
          "Field password must not be empty.",
        ];

        strictEqual(errorObject.status, 422);
        messages.forEach((message) => {
          strictEqual(
            errorObject.message.includes(message),
            true,
            `Validation return should contain '${message}'`
          );
        });
      });

      it("(422) Should fail with field is email and string messages", async () => {
        const email = "aaaa";
        const password = 1;

        const next = mock.fn();
        const req = generateReq({ email, password });

        await validateFn(req, null, next);

        strictEqual(next.mock.callCount(), 1);
        strictEqual(next.mock.calls[0].arguments.length, 1);

        const errorObject = next.mock.calls[0].arguments[0];
        const messages = [
          "Field email must be a valid email.",
          "Field password must be a string.",
        ];

        strictEqual(errorObject.status, 422);
        messages.forEach((message) => {
          strictEqual(
            errorObject.message.includes(message),
            true,
            `Validation return should contain '${message}'`
          );
        });
      });
    });
  });
  describe("Controller", () => {
    const getModelMock = () => ({
      async findOne() {
        return { email: "abc@def.com", token: "YWJjQGRlZi5jb206MTIzNDU2" };
      },
    });

    /** @type {AuthController} */
    let controller,
      /** @type {AuthService} */
      service,
      /** @type {AuthRepository} */
      repository,
      /** @type {ReturnType<getModelMock>} */
      model;

    beforeEach(() => {
      model = getModelMock();
      repository = new AuthRepository(model);
      service = new AuthService(repository);
      controller = new AuthController(service);
    });

    describe("auth", () => {
      const req = {
        headers: { authorization: "Basic YWJjQGRlZi5jb206MTIzNDU2" },
      };

      it("(200) Should authorize request", async () => {
        const email = "abc@def.com";
        const next = mock.fn();

        await controller.auth(req, null, next);

        strictEqual(req.user, email);
        strictEqual(next.mock.callCount(), 1);
        strictEqual(next.mock.calls[0].arguments.length, 0);
      });

      it("(401) Should not authorize request", async () => {
        const next = mock.fn();
        model.findOne = mock.fn();

        model.findOne.mock.mockImplementationOnce(() => undefined);

        await controller.auth(req, null, next);

        strictEqual(next.mock.callCount(), 1);
        strictEqual(next.mock.calls[0].arguments.length, 1);

        const errorObject = next.mock.calls[0].arguments[0];
        const message = "Token not authorized.";

        deepStrictEqual(errorObject, new UnauthorizedError(message));
      });
    });
    describe("token", () => {
      const req = {
        body: { email: "abc@def.com", password: "123456" },
      };

      it("(200) Should return token from specifed user", async () => {
        const token = "YWJjQGRlZi5jb206MTIzNDU2";

        const result = await controller.token(req);

        deepStrictEqual(result, new SuccessResponse({ token }));
      });

      it("(401) Should not return token from specifed user", async () => {
        model.findOne = mock.fn();

        model.findOne.mock.mockImplementationOnce(() => undefined);

        const result = await controller.token(req);

        deepStrictEqual(result, new UnauthorizedError("Invalid credentials."));
      });
    });
  });
});
