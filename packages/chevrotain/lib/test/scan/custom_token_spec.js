"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tokens_public_1 = require("../../src/scan/tokens_public");
var lexer_public_1 = require("../../src/scan/lexer_public");
var chai_1 = require("chai");
describe("The Chevrotain Custom Tokens Support", function () {
    context("Token Payloads", function () {
        it("Support payloads with custom Token Patterns", function () {
            var dateToken = (0, tokens_public_1.createToken)({
                name: "date",
                pattern: function (text, startOffset) {
                    var regExp = /(\d\d?)-(\d\d?)-(\d\d\d\d)/y;
                    regExp.lastIndex = startOffset;
                    var match = regExp.exec(text);
                    if (match !== null) {
                        var payload = {
                            day: parseInt(match[1], 10),
                            month: parseInt(match[2], 10),
                            year: parseInt(match[3], 10)
                        };
                        match.payload = payload;
                        return match;
                    }
                    return null;
                }
            });
            var dateLexer = new lexer_public_1.Lexer([dateToken]);
            var lexResults = dateLexer.tokenize("1-12-1932");
            (0, chai_1.expect)(lexResults.errors).to.be.empty;
            (0, chai_1.expect)(lexResults.tokens).to.have.lengthOf(1);
            var dateTokObj = lexResults.tokens[0];
            (0, chai_1.expect)(dateTokObj.payload.day).to.equal(1);
            (0, chai_1.expect)(dateTokObj.payload.month).to.equal(12);
            (0, chai_1.expect)(dateTokObj.payload.year).to.equal(1932);
        });
        it("Supports payloads with custom Token Patterns - longer alt", function () {
            var dateToken = (0, tokens_public_1.createToken)({
                name: "date",
                pattern: function (text, startOffset) {
                    var regExp = /(\d\d?)-(\d\d?)-(\d\d\d\d)/y;
                    regExp.lastIndex = startOffset;
                    var match = regExp.exec(text);
                    if (match !== null) {
                        var payload = {
                            day: parseInt(match[1], 10),
                            month: parseInt(match[2], 10),
                            year: parseInt(match[3], 10)
                        };
                        match.payload = payload;
                        return match;
                    }
                    return null;
                }
            });
            var digitToken = (0, tokens_public_1.createToken)({
                name: "digit",
                pattern: /\d/,
                longer_alt: dateToken
            });
            var dateLexer = new lexer_public_1.Lexer([digitToken, dateToken]);
            var lexResults = dateLexer.tokenize("1-12-1932");
            (0, chai_1.expect)(lexResults.errors).to.be.empty;
            (0, chai_1.expect)(lexResults.tokens).to.have.lengthOf(1);
            var dateTokObj = lexResults.tokens[0];
            (0, chai_1.expect)(dateTokObj.payload.day).to.equal(1);
            (0, chai_1.expect)(dateTokObj.payload.month).to.equal(12);
            (0, chai_1.expect)(dateTokObj.payload.year).to.equal(1932);
        });
    });
});
//# sourceMappingURL=custom_token_spec.js.map