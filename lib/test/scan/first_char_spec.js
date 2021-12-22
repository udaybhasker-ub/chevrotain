"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reg_exp_parser_1 = require("../../src/scan/reg_exp_parser");
var reg_exp_1 = require("../../src/scan/reg_exp");
var chai_1 = require("chai");
describe("The Chevrotain Lexer First Char Optimization", function () {
    it("considers ignoreCase flag", function () {
        var ast = (0, reg_exp_parser_1.getRegExpAst)(/a/i);
        var firstChars = (0, reg_exp_1.firstCharOptimizedIndices)(ast.value, {}, ast.flags.ignoreCase);
        (0, chai_1.expect)(firstChars).to.deep.equal([65, 97]);
    });
    it("considers ignoreCase in range", function () {
        var ast = (0, reg_exp_parser_1.getRegExpAst)(/[a-b]/i);
        var firstChars = (0, reg_exp_1.firstCharOptimizedIndices)(ast.value, {}, ast.flags.ignoreCase);
        (0, chai_1.expect)(firstChars).to.deep.equal([65, 66, 97, 98]);
    });
    it("Handles Large CharCode ranges", function () {
        var ast = (0, reg_exp_parser_1.getRegExpAst)(/[\u0100-\u04C4]/);
        var firstChars = (0, reg_exp_1.firstCharOptimizedIndices)(ast.value, {}, ast.flags.ignoreCase);
        (0, chai_1.expect)(firstChars).to.deep.equal([256, 257, 258, 259]);
    });
    it("Handles Large CharCode ranges #2", function () {
        var ast = (0, reg_exp_parser_1.getRegExpAst)(/[\u00ff-\u04C4]/);
        var firstChars = (0, reg_exp_1.firstCharOptimizedIndices)(ast.value, {}, ast.flags.ignoreCase);
        (0, chai_1.expect)(firstChars).to.deep.equal([255, 256, 257, 258, 259]);
    });
});
//# sourceMappingURL=first_char_spec.js.map