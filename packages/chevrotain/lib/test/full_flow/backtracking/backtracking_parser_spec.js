"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var backtracking_parser_1 = require("./backtracking_parser");
var flatten_1 = __importDefault(require("lodash/flatten"));
var matchers_1 = require("../../utils/matchers");
describe("Simple backtracking example", function () {
    var largeFqnTokenVector;
    before(function () {
        // for side effect of augmenting the tokens metadata
        new backtracking_parser_1.BackTrackingParser();
        // TODO: modify example to use the Chevrotain Lexer to increase readability
        largeFqnTokenVector = [
            (0, matchers_1.createRegularToken)(backtracking_parser_1.IdentTok, "ns1"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.DotTok, "."),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.IdentTok, "ns2"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.DotTok, "."),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.IdentTok, "ns3"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.DotTok, "."),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.IdentTok, "ns4"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.DotTok, "."),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.IdentTok, "ns5"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.DotTok, "."),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.IdentTok, "ns6"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.DotTok, "."),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.IdentTok, "ns7"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.DotTok, "."),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.IdentTok, "ns8"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.DotTok, "."),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.IdentTok, "ns9"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.DotTok, "."),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.IdentTok, "ns10"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.DotTok, "."),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.IdentTok, "ns11"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.DotTok, "."),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.IdentTok, "ns12")
        ];
    });
    it("can parse an element with Equals and a very long qualified name", function () {
        var input = (0, flatten_1.default)([
            // element A:ns1.ns2.ns3.ns4.ns5.ns6.ns7.ns8.ns9.ns10.ns11.ns12 = 666;
            (0, matchers_1.createRegularToken)(backtracking_parser_1.ElementTok, "element"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.IdentTok, "A"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.ColonTok, ":"),
            largeFqnTokenVector,
            (0, matchers_1.createRegularToken)(backtracking_parser_1.EqualsTok, "="),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.NumberTok, "666"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.SemiColonTok, ";")
        ]);
        var parser = new backtracking_parser_1.BackTrackingParser();
        parser.input = input;
        var result = parser.statement();
        (0, chai_1.expect)(parser.errors.length).to.equal(0);
        (0, chai_1.expect)(result).to.equal(backtracking_parser_1.RET_TYPE.WITH_EQUALS);
    });
    it("can parse an element with Default and a very long qualified name", function () {
        var input = (0, flatten_1.default)([
            // element A:ns1.ns2.ns3.ns4.ns5.ns6.ns7.ns8.ns9.ns10.ns11.ns12 default 666;
            (0, matchers_1.createRegularToken)(backtracking_parser_1.ElementTok, "element"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.IdentTok, "A"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.ColonTok, ":"),
            largeFqnTokenVector,
            (0, matchers_1.createRegularToken)(backtracking_parser_1.DefaultTok, "deafult"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.NumberTok, "666"),
            (0, matchers_1.createRegularToken)(backtracking_parser_1.SemiColonTok, ";")
        ]);
        var parser = new backtracking_parser_1.BackTrackingParser();
        parser.input = input;
        var result = parser.statement();
        (0, chai_1.expect)(parser.errors.length).to.equal(0);
        (0, chai_1.expect)(result).to.equal(backtracking_parser_1.RET_TYPE.WITH_DEFAULT);
    });
});
//# sourceMappingURL=backtracking_parser_spec.js.map