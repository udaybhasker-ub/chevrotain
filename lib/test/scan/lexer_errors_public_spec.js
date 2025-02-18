"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_errors_public_1 = require("../../src/scan/lexer_errors_public");
var chai_1 = require("chai");
describe("The Chevrotain default lexer error message provider", function () {
    it("Will build unexpected character message", function () {
        var input = "1 LETTERS EXIT_LETTERS +";
        var msg = lexer_errors_public_1.defaultLexerErrorProvider.buildUnexpectedCharactersMessage(input, 23, 1, 0, 23);
        (0, chai_1.expect)(msg).to.equal("unexpected character: ->+<- at offset: 23, skipped 1 characters.");
    });
    it("Will build an unable to pop lexer mode error message ", function () {
        var popToken = {
            image: "EXIT_NUMBERS",
            startOffset: 3
        }; // the token type is not relevant for this test
        var msg = lexer_errors_public_1.defaultLexerErrorProvider.buildUnableToPopLexerModeMessage(popToken);
        (0, chai_1.expect)(msg).to.equal("Unable to pop Lexer Mode after encountering Token ->EXIT_NUMBERS<- The Mode Stack is empty");
    });
});
//# sourceMappingURL=lexer_errors_public_spec.js.map