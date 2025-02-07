import { beforeEach, describe, it, mock } from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import { validate } from "../../utils/validator.util.js";
import { UserValidator } from "./user.validator.js";
import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";
import {
  ConflictError,
  CreatedResponse,
  NoContentResponse,
  SuccessResponse,
} from "../../utils/http.util.js";

describe("User", () => {
  describe("Validation", () => {
    describe("create", () => {
      const validateFn = validate(UserValidator.create);

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

      it("(422) Should fail with field not empty and length messages", async () => {
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
          "Field password must have at least 8 characters and contain at least 1 lowercase, uppercase, number and symbol.",
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

      it("(422) Should fail with field is incorrect email and incorrect password length messages", async () => {
        const email = "aaaa";
        const password = "Aa1@";

        const next = mock.fn();
        const req = generateReq({ email, password });

        await validateFn(req, null, next);

        strictEqual(next.mock.callCount(), 1);
        strictEqual(next.mock.calls[0].arguments.length, 1);

        const errorObject = next.mock.calls[0].arguments[0];
        const messages = [
          "Field email must be a valid email.",
          "Field password must have at least 8 characters and contain at least 1 lowercase, uppercase, number and symbol.",
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

      [
        ["lowercase", "AAAAAA1@"],
        ["uppercase", "aaaaaa1@"],
        ["number", "AAAAAAa@"],
        ["symbol", "AAAAAAa1"],
      ].forEach(([testCase, password]) => {
        it(`(422) Should fail with field is incorrect password message (no ${testCase})`, async () => {
          const next = mock.fn();
          const req = generateReq({ password });

          await validateFn(req, null, next);

          strictEqual(next.mock.callCount(), 1);
          strictEqual(next.mock.calls[0].arguments.length, 1);

          const errorObject = next.mock.calls[0].arguments[0];
          const message =
            "Field password must have at least 8 characters and contain at least 1 lowercase, uppercase, number and symbol.";

          strictEqual(errorObject.status, 422);
          strictEqual(
            errorObject.message.includes(message),
            true,
            `Validation return should contain '${message}'`
          );
        });
      });
    });
    describe("update", () => {
      const validateFn = validate(UserValidator.update);

      const generateReq = (password) => ({
        body: { password },
      });

      it("(200) Should pass with valid body", async () => {
        const password = "AbCd1@3$";

        const next = mock.fn();
        const req = generateReq(password);

        await validateFn(req, null, next);

        strictEqual(next.mock.callCount(), 1);
        deepStrictEqual(next.mock.calls[0].arguments, [undefined]);
      });

      it("(200) Should pass with an empty body", async () => {
        const next = mock.fn();
        const req = generateReq();

        await validateFn(req, null, next);

        strictEqual(next.mock.callCount(), 1);
        deepStrictEqual(next.mock.calls[0].arguments, [undefined]);
      });

      it("(422) Should fail with field is incorrect password length message", async () => {
        const password = "Aa1@";

        const next = mock.fn();
        const req = generateReq({ password });

        await validateFn(req, null, next);

        strictEqual(next.mock.callCount(), 1);
        strictEqual(next.mock.calls[0].arguments.length, 1);

        const errorObject = next.mock.calls[0].arguments[0];
        const message =
          "Field password must have at least 8 characters and contain at least 1 lowercase, uppercase, number and symbol.";

        strictEqual(errorObject.status, 422);
        strictEqual(
          errorObject.message.includes(message),
          true,
          `Validation return should contain '${message}'`
        );
      });

      [
        ["lowercase", "AAAAAA1@"],
        ["uppercase", "aaaaaa1@"],
        ["number", "AAAAAAa@"],
        ["symbol", "AAAAAAa1"],
      ].forEach(([testCase, password]) => {
        it(`(422) Should fail with field is incorrect password message (no ${testCase})`, async () => {
          const next = mock.fn();
          const req = generateReq({ password });

          await validateFn(req, null, next);

          strictEqual(next.mock.callCount(), 1);
          strictEqual(next.mock.calls[0].arguments.length, 1);

          const errorObject = next.mock.calls[0].arguments[0];
          const message =
            "Field password must have at least 8 characters and contain at least 1 lowercase, uppercase, number and symbol.";

          strictEqual(errorObject.status, 422);
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
      async create() {},
      async update() {},
      async destroy() {},
    });

    /** @type {UserController} */
    let controller,
      /** @type {UserService} */
      service,
      /** @type {UserRepository} */
      repository,
      /** @type {ReturnType<getModelMock>} */
      model;

    beforeEach(() => {
      model = getModelMock();
      repository = new UserRepository(model);
      service = new UserService(repository);
      controller = new UserController(service);
    });

    describe("create", () => {
      const req = {
        body: { email: "abc@def.com", password: "123456" },
      };

      it("(201) Should return token from created user", async () => {
        model.findOne = mock.fn();
        model.create = mock.fn();

        model.findOne.mock.mockImplementationOnce(() => undefined);

        const email = "abc@def.com";
        const token = "YWJjQGRlZi5jb206MTIzNDU2";

        const result = await controller.create(req);

        deepStrictEqual(result, new CreatedResponse({ token }));
        strictEqual(model.create.mock.callCount(), 1);
        strictEqual(model.create.mock.calls[0].arguments.length, 2);
        deepStrictEqual(model.create.mock.calls[0].arguments[0], {
          email,
          token,
        });
        deepStrictEqual(model.create.mock.calls[0].arguments[1], {
          fields: ["email", "token"],
        });
      });

      it("(409) Should not create user with identical email", async () => {
        const email = "abc@def.com";

        const result = await controller.create(req);

        deepStrictEqual(
          result,
          new ConflictError(`User with email ${email} already exists.`)
        );
      });
    });

    describe("update", () => {
      const req = {
        user: "abc@def.com",
        body: { password: "654321" },
      };

      it("(200) Should return token from updated user", async () => {
        model.findOne = mock.fn();
        model.update = mock.fn();

        model.findOne.mock.mockImplementationOnce(() => undefined);

        const email = "abc@def.com";
        const token = "YWJjQGRlZi5jb206NjU0MzIx";

        const result = await controller.update(req);

        deepStrictEqual(result, new SuccessResponse({ token }));
        strictEqual(model.update.mock.callCount(), 1);
        strictEqual(model.update.mock.calls[0].arguments.length, 2);
        deepStrictEqual(model.update.mock.calls[0].arguments[0], { token });
        deepStrictEqual(model.update.mock.calls[0].arguments[1], {
          where: { email },
          fields: ["token"],
        });
      });
    });

    describe("delete", () => {
      const req = {
        user: "abc@def.com",
        body: { password: "654321" },
      };

      it("(204) Should delete user", async () => {
        model.findOne = mock.fn();
        model.destroy = mock.fn();

        model.findOne.mock.mockImplementationOnce(() => undefined);

        const email = "abc@def.com";

        const result = await controller.delete(req);

        deepStrictEqual(result, new NoContentResponse());
        strictEqual(model.destroy.mock.callCount(), 1);
        strictEqual(model.destroy.mock.calls[0].arguments.length, 1);
        deepStrictEqual(model.destroy.mock.calls[0].arguments[0], {
          where: { email },
        });
      });
    });
  });
});
