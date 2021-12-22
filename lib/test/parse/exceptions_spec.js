"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorStackParser = __importStar(require("error-stack-parser"));
var tokens_public_1 = require("../../src/scan/tokens_public");
var exceptions_public_1 = require("../../src/parse/exceptions_public");
var chai_1 = require("chai");
describe("Chevrotain's Parsing Exceptions", function () {
    describe("the exception instance subclasses Error with the right properties for: ", function () {
        var currentToken;
        var previousToken;
        before(function () {
            currentToken = (0, tokens_public_1.createTokenInstance)(tokens_public_1.EOF, "cur", -1, -1, -1, -1, -1, -1);
            previousToken = (0, tokens_public_1.createTokenInstance)(tokens_public_1.EOF, "prv", -1, -1, -1, -1, -1, -1);
        });
        it("EarlyExitException", function () {
            var exceptionInstance = new exceptions_public_1.EarlyExitException("error message", currentToken, previousToken);
            (0, chai_1.expect)(exceptionInstance).to.be.an.instanceOf(exceptions_public_1.EarlyExitException);
            (0, chai_1.expect)(exceptionInstance).to.be.an.instanceOf(Error);
            (0, chai_1.expect)(exceptionInstance.name).to.equal("EarlyExitException");
            (0, chai_1.expect)(exceptionInstance.message).to.equal("error message");
            (0, chai_1.expect)(exceptionInstance.token).to.equal(currentToken);
            (0, chai_1.expect)(exceptionInstance.previousToken).to.equal(previousToken);
            (0, chai_1.expect)(exceptionInstance.resyncedTokens).to.be.empty;
        });
        it("NoViableAltException", function () {
            var exceptionInstance = new exceptions_public_1.NoViableAltException("error message", currentToken, previousToken);
            (0, chai_1.expect)(exceptionInstance).to.be.an.instanceOf(exceptions_public_1.NoViableAltException);
            (0, chai_1.expect)(exceptionInstance).to.be.an.instanceOf(Error);
            (0, chai_1.expect)(exceptionInstance.name).to.equal("NoViableAltException");
            (0, chai_1.expect)(exceptionInstance.message).to.equal("error message");
            (0, chai_1.expect)(exceptionInstance.token).to.equal(currentToken);
            (0, chai_1.expect)(exceptionInstance.previousToken).to.equal(previousToken);
            (0, chai_1.expect)(exceptionInstance.resyncedTokens).to.be.empty;
        });
        it("NotAllInputParsedException", function () {
            var exceptionInstance = new exceptions_public_1.NotAllInputParsedException("error message", currentToken);
            (0, chai_1.expect)(exceptionInstance).to.be.an.instanceOf(exceptions_public_1.NotAllInputParsedException);
            (0, chai_1.expect)(exceptionInstance).to.be.an.instanceOf(Error);
            (0, chai_1.expect)(exceptionInstance.name).to.equal("NotAllInputParsedException");
            (0, chai_1.expect)(exceptionInstance.message).to.equal("error message");
            (0, chai_1.expect)(exceptionInstance.token).to.equal(currentToken);
            (0, chai_1.expect)(exceptionInstance.resyncedTokens).to.be.empty;
        });
        it("MismatchedTokenException", function () {
            var exceptionInstance = new exceptions_public_1.MismatchedTokenException("error message", currentToken, previousToken);
            (0, chai_1.expect)(exceptionInstance).to.be.an.instanceOf(exceptions_public_1.MismatchedTokenException);
            (0, chai_1.expect)(exceptionInstance).to.be.an.instanceOf(Error);
            (0, chai_1.expect)(exceptionInstance.name).to.equal("MismatchedTokenException");
            (0, chai_1.expect)(exceptionInstance.message).to.equal("error message");
            (0, chai_1.expect)(exceptionInstance.token).to.equal(currentToken);
            (0, chai_1.expect)(exceptionInstance.resyncedTokens).to.be.empty;
        });
    });
    describe("the exception instance stacktrace is valid for: ", function () {
        var dummyToken = (0, tokens_public_1.createTokenInstance)(tokens_public_1.EOF, "cur", -1, -1, -1, -1, -1, -1);
        function throwAndCatchException(errorFactory) {
            try {
                throw errorFactory();
            }
            catch (e) {
                return e;
            }
        }
        it("EarlyExitException", function () {
            var exceptionInstance = throwAndCatchException(function () { return new exceptions_public_1.EarlyExitException("", dummyToken, dummyToken); });
            var stacktrace = ErrorStackParser.parse(exceptionInstance);
            (0, chai_1.expect)(stacktrace[0].functionName).to.be.undefined; // lambda function
            (0, chai_1.expect)(stacktrace[1].functionName).to.equal("throwAndCatchException");
        });
        it("NoViableAltException", function () {
            var exceptionInstance = throwAndCatchException(function () { return new exceptions_public_1.NoViableAltException("", dummyToken, dummyToken); });
            var stacktrace = ErrorStackParser.parse(exceptionInstance);
            (0, chai_1.expect)(stacktrace[0].functionName).to.be.undefined; // lambda function
            (0, chai_1.expect)(stacktrace[1].functionName).to.equal("throwAndCatchException");
        });
        it("NotAllInputParsedException", function () {
            var exceptionInstance = throwAndCatchException(function () { return new exceptions_public_1.NotAllInputParsedException("", dummyToken); });
            var stacktrace = ErrorStackParser.parse(exceptionInstance);
            (0, chai_1.expect)(stacktrace[0].functionName).to.be.undefined; // lambda function
            (0, chai_1.expect)(stacktrace[1].functionName).to.equal("throwAndCatchException");
        });
        it("MismatchedTokenException", function () {
            var exceptionInstance = throwAndCatchException(function () { return new exceptions_public_1.MismatchedTokenException("", dummyToken, dummyToken); });
            var stacktrace = ErrorStackParser.parse(exceptionInstance);
            (0, chai_1.expect)(stacktrace[0].functionName).to.be.undefined; // lambda function
            (0, chai_1.expect)(stacktrace[1].functionName).to.equal("throwAndCatchException");
        });
    });
});
//# sourceMappingURL=exceptions_spec.js.map