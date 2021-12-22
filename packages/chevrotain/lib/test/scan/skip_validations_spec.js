"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_public_1 = require("../../src/scan/lexer_public");
var flatten_1 = __importDefault(require("lodash/flatten"));
var find_1 = __importDefault(require("lodash/find"));
var chai_1 = require("chai");
describe("Chevrotain's Lexer Init Performance Tracing", function () {
    var consoleLogSpy;
    beforeEach(function () {
        // @ts-ignore
        consoleLogSpy = sinon.spy(console, "log");
    });
    afterEach(function () {
        // @ts-ignore
        console.log.restore();
    });
    it("Will not skipValidation by default", function () {
        new lexer_public_1.Lexer([], { traceInitPerf: true });
        (0, chai_1.expect)(consoleLogSpy).to.have.been.called;
        var consoleArgs = (0, flatten_1.default)(consoleLogSpy.args);
        var runtimeChecksArg = (0, find_1.default)(consoleArgs, function (item) {
            return /performRuntimeChecks/.test(item);
        });
        (0, chai_1.expect)(runtimeChecksArg).to.not.be.undefined;
        var warningRuntimeChecksAra = (0, find_1.default)(consoleArgs, function (item) {
            return /performWarningRuntimeChecks/.test(item);
        });
        (0, chai_1.expect)(warningRuntimeChecksAra).to.not.be.undefined;
        var validateArg = (0, find_1.default)(consoleArgs, function (item) {
            return /validatePatterns/.test(item);
        });
        (0, chai_1.expect)(validateArg).to.not.be.undefined;
    });
    it("Will avoid running lexer validations when `skipValidations` is enabled", function () {
        new lexer_public_1.Lexer([], { traceInitPerf: true, skipValidations: true });
        (0, chai_1.expect)(consoleLogSpy).to.have.been.called;
        var consoleArgs = (0, flatten_1.default)(consoleLogSpy.args);
        var runtimeChecksArg = (0, find_1.default)(consoleArgs, function (item) {
            return /performRuntimeChecks/.test(item);
        });
        (0, chai_1.expect)(runtimeChecksArg).to.be.undefined;
        var warningRuntimeChecksAra = (0, find_1.default)(consoleArgs, function (item) {
            return /performWarningRuntimeChecks/.test(item);
        });
        (0, chai_1.expect)(warningRuntimeChecksAra).to.be.undefined;
        var validateArg = (0, find_1.default)(consoleArgs, function (item) {
            return /validatePatterns/.test(item);
        });
        (0, chai_1.expect)(validateArg).to.be.undefined;
    });
});
//# sourceMappingURL=skip_validations_spec.js.map