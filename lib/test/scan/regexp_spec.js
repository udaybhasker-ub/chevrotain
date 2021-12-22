"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tokens_public_1 = require("../../src/scan/tokens_public");
var lexer_public_1 = require("../../src/scan/lexer_public");
var reg_exp_1 = require("../../src/scan/reg_exp");
var chai_1 = require("chai");
describe("The Chevrotain regexp analysis", function () {
    it("Will re-attempt none 'optimized' patterns if the optimization failed", function () {
        // won't be automatically optimized due to the '|' meta characters
        var Boolean = (0, tokens_public_1.createToken)({
            name: "Boolean",
            pattern: /true|false/,
            // But we provide the hints so it can be optimized
            start_chars_hint: ["t", "f"]
        });
        // simple string can perform optimization
        var Function = (0, tokens_public_1.createToken)({ name: "Function", pattern: "function" });
        // won't be optimized due to the '\w' and '+'
        var Name = (0, tokens_public_1.createToken)({ name: "False", pattern: /\w+/ });
        var WhiteSpace = (0, tokens_public_1.createToken)({
            name: "WhiteSpace",
            pattern: /\s+/,
            group: lexer_public_1.Lexer.SKIPPED,
            line_breaks: true
        });
        var allTokens = [WhiteSpace, Boolean, Function, Name];
        var JsonLexer = new lexer_public_1.Lexer(allTokens);
        var lexResult = JsonLexer.tokenize("fool");
        (0, chai_1.expect)(lexResult.tokens).to.have.lengthOf(1);
        (0, chai_1.expect)(lexResult.tokens[0].tokenType).to.equal(Name);
    });
});
describe("the regExp analysis", function () {
    context("first codes", function () {
        it("can compute for string literal", function () {
            (0, chai_1.expect)((0, reg_exp_1.getOptimizedStartCodesIndices)(/"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/)).to.deep.equal([34]);
        });
        it("can compute with assertions", function () {
            (0, chai_1.expect)((0, reg_exp_1.getOptimizedStartCodesIndices)(/^$\b\Ba/)).to.deep.equal([97]);
        });
        it("can compute ranges", function () {
            (0, chai_1.expect)((0, reg_exp_1.getOptimizedStartCodesIndices)(/[\n-\r]/)).to.deep.equal([
                10, 11, 12, 13
            ]);
        });
        it("can compute with optional quantifiers", function () {
            (0, chai_1.expect)((0, reg_exp_1.getOptimizedStartCodesIndices)(/b*a/)).to.deep.equal([97, 98]);
        });
        it("will not compute when using complements", function () {
            (0, chai_1.expect)((0, reg_exp_1.getOptimizedStartCodesIndices)(/\D/)).to.be.empty;
        });
        it("Can compute for ignore case", function () {
            (0, chai_1.expect)((0, reg_exp_1.getOptimizedStartCodesIndices)(/w|A/i)).to.deep.equal([
                65, 87, 97, 119
            ]);
        });
        it("will not compute when using complements #2", function () {
            (0, chai_1.expect)((0, reg_exp_1.getOptimizedStartCodesIndices)(/[^a-z]/, true)).to.be.empty;
        });
        it("correctly handles nested groups with and without quantifiers", function () {
            (0, chai_1.expect)((0, reg_exp_1.getOptimizedStartCodesIndices)(/(?:)c/)).to.deep.equal([99]);
            (0, chai_1.expect)((0, reg_exp_1.getOptimizedStartCodesIndices)(/((ab)?)c/)).to.deep.equal([97, 99]);
            (0, chai_1.expect)((0, reg_exp_1.getOptimizedStartCodesIndices)(/((ab))(c)/)).to.deep.equal([97]);
            (0, chai_1.expect)((0, reg_exp_1.getOptimizedStartCodesIndices)(/((ab))?c/)).to.deep.equal([97, 99]);
            (0, chai_1.expect)((0, reg_exp_1.getOptimizedStartCodesIndices)(/((a?((b?))))?c/)).to.deep.equal([
                97, 98, 99
            ]);
            (0, chai_1.expect)((0, reg_exp_1.getOptimizedStartCodesIndices)(/((a?((b))))c/)).to.deep.equal([
                97, 98
            ]);
            (0, chai_1.expect)((0, reg_exp_1.getOptimizedStartCodesIndices)(/((a+((b))))c/)).to.deep.equal([97]);
        });
    });
    context("can match charCode", function () {
        it("with simple character valid", function () {
            (0, chai_1.expect)((0, reg_exp_1.canMatchCharCode)([10, 13], /\n/)).to.be.true;
        });
        it("with simple character invalid", function () {
            (0, chai_1.expect)((0, reg_exp_1.canMatchCharCode)([10, 13], /a/)).to.be.false;
        });
        it("with range valid", function () {
            (0, chai_1.expect)((0, reg_exp_1.canMatchCharCode)([13], /[\n-a]/)).to.be.true;
        });
        it("with range invalid", function () {
            (0, chai_1.expect)((0, reg_exp_1.canMatchCharCode)([10, 13], /a-z/)).to.be.false;
        });
        it("with range complement valid", function () {
            (0, chai_1.expect)((0, reg_exp_1.canMatchCharCode)([13], /[^a]/)).to.be.true;
        });
        it("with range complement invalid", function () {
            (0, chai_1.expect)((0, reg_exp_1.canMatchCharCode)([13], /[^\r]/)).to.be.false;
        });
    });
});
//# sourceMappingURL=regexp_spec.js.map