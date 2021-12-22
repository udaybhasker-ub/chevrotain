"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tokens_public_1 = require("../../src/scan/tokens_public");
var lexer_public_1 = require("../../src/scan/lexer_public");
var tokens_public_2 = require("../../src/scan/tokens_public");
var tokens_1 = require("../../src/scan/tokens");
var chai_1 = require("chai");
describe("The Chevrotain Tokens namespace", function () {
    context("createToken", function () {
        var TrueLiteral;
        var A;
        var B;
        var C;
        var D;
        var Plus;
        before(function () {
            TrueLiteral = (0, tokens_public_1.createToken)({ name: "TrueLiteral" });
            A = (0, tokens_public_1.createToken)({ name: "A" });
            B = (0, tokens_public_1.createToken)({ name: "B", categories: A });
            B.GROUP = "Special";
            C = (0, tokens_public_1.createToken)({
                name: "C",
                pattern: /\d+/,
                categories: B
            });
            D = (0, tokens_public_1.createToken)({
                name: "D",
                pattern: /\w+/,
                categories: B
            });
            Plus = (0, tokens_public_1.createToken)({ name: "Plus", pattern: /\+/ });
            Plus.LABEL = "+";
        });
        it("assigns `name` property to tokenTypes", function () {
            // FalseLiteral was created with an anonymous function as its constructor yet tokenName(...)
            // should still work correctly on it if the 'tokenName' property has been set on its constructor.
            (0, chai_1.expect)(TrueLiteral.name).to.equal("TrueLiteral");
            (0, chai_1.expect)((0, tokens_public_1.tokenName)(TrueLiteral)).to.equal("TrueLiteral");
        });
        it("provides an createTokenInstance utility - creating an instance", function () {
            var aInstance = (0, tokens_public_2.createTokenInstance)(A, "Hello", 0, 4, 1, 1, 1, 5);
            (0, chai_1.expect)(aInstance.image).to.equal("Hello");
            (0, chai_1.expect)(aInstance.startOffset).to.equal(0);
            (0, chai_1.expect)(aInstance.endOffset).to.equal(4);
            (0, chai_1.expect)(aInstance.startLine).to.equal(1);
            (0, chai_1.expect)(aInstance.endLine).to.equal(1);
            (0, chai_1.expect)(aInstance.startColumn).to.equal(1);
            (0, chai_1.expect)(aInstance.endColumn).to.equal(5);
        });
        it("provides an extendToken utility - creating a subclass instance", function () {
            var aInstance = (0, tokens_public_2.createTokenInstance)(A, "World", 0, 4, 1, 1, 1, 5);
            (0, chai_1.expect)(aInstance.image).to.equal("World");
            (0, chai_1.expect)(aInstance.startOffset).to.equal(0);
            (0, chai_1.expect)(aInstance.endOffset).to.equal(4);
            (0, chai_1.expect)(aInstance.startLine).to.equal(1);
            (0, chai_1.expect)(aInstance.endLine).to.equal(1);
            (0, chai_1.expect)(aInstance.startColumn).to.equal(1);
            (0, chai_1.expect)(aInstance.endColumn).to.equal(5);
        });
        it("Allows customization of the label", function () {
            // Default to class name
            (0, chai_1.expect)((0, tokens_public_1.tokenLabel)(B)).to.equal("B");
            // Unless there's a LABEL property
            (0, chai_1.expect)((0, tokens_public_1.tokenLabel)(Plus)).to.equal("+");
        });
        it("provides a utility to verify if a token instance matches a Token Type", function () {
            var ATokRegular = (0, tokens_public_1.createToken)({
                name: "ATokRegular"
            });
            var BTokRegular = (0, tokens_public_1.createToken)({
                name: "BTokRegular"
            });
            var AInstanceRegular = (0, tokens_public_2.createTokenInstance)(ATokRegular, "a", -1, -1, -1, -1, -1, -1);
            var BInstanceRegular = (0, tokens_public_2.createTokenInstance)(BTokRegular, "b", -1, -1, -1, -1, -1, -1);
            (0, chai_1.expect)((0, tokens_public_1.tokenMatcher)(AInstanceRegular, ATokRegular)).to.be.true;
            (0, chai_1.expect)((0, tokens_public_1.tokenMatcher)(AInstanceRegular, BTokRegular)).to.be.false;
            (0, chai_1.expect)((0, tokens_public_1.tokenMatcher)(BInstanceRegular, BTokRegular)).to.be.true;
            (0, chai_1.expect)((0, tokens_public_1.tokenMatcher)(BInstanceRegular, ATokRegular)).to.be.false;
        });
        it("Will augment Token Constructors with additional metadata basic", function () {
            var A = (0, tokens_public_1.createToken)({ name: "A" });
            var B = (0, tokens_public_1.createToken)({ name: "B" });
            (0, chai_1.expect)(A.tokenTypeIdx).to.be.greaterThan(0);
            (0, chai_1.expect)(B.tokenTypeIdx).to.be.greaterThan(A.tokenTypeIdx);
            (0, chai_1.expect)(A.categoryMatches).to.be.an.instanceOf(Array);
            (0, chai_1.expect)(A.categoryMatches).to.be.empty;
            (0, chai_1.expect)(B.categoryMatches).to.be.an.instanceOf(Array);
            (0, chai_1.expect)(B.categoryMatches).to.be.empty;
        });
        it("can define a token Label via the createToken utilities", function () {
            var A = (0, tokens_public_1.createToken)({
                name: "A",
                label: "bamba"
            });
            (0, chai_1.expect)((0, tokens_public_1.tokenLabel)(A)).to.equal("bamba");
        });
        it("can define a POP_MODE via the createToken utilities", function () {
            var A = (0, tokens_public_1.createToken)({
                name: "A",
                pop_mode: true
            });
            (0, chai_1.expect)(A).to.haveOwnProperty("POP_MODE");
            (0, chai_1.expect)(A.POP_MODE).to.be.true;
        });
        it("can define a PUSH_MODE via the createToken utilities", function () {
            var A = (0, tokens_public_1.createToken)({
                name: "A",
                push_mode: "attribute"
            });
            (0, chai_1.expect)(A).to.haveOwnProperty("PUSH_MODE");
            (0, chai_1.expect)(A.PUSH_MODE).to.equal("attribute");
        });
        it("can define a LONGER_ALT via the createToken utilities", function () {
            var A = (0, tokens_public_1.createToken)({ name: "A" });
            var B = (0, tokens_public_1.createToken)({ name: "B", longer_alt: A });
            (0, chai_1.expect)(B).to.haveOwnProperty("LONGER_ALT");
            (0, chai_1.expect)(B.LONGER_ALT).to.equal(A);
        });
        it("can define multiple LONGER_ALT via the createToken utilities", function () {
            var A = (0, tokens_public_1.createToken)({ name: "A" });
            var B = (0, tokens_public_1.createToken)({ name: "B" });
            var C = (0, tokens_public_1.createToken)({ name: "C", longer_alt: [A, B] });
            (0, chai_1.expect)(C).to.haveOwnProperty("LONGER_ALT");
            (0, chai_1.expect)(C.LONGER_ALT).to.eql([A, B]);
        });
        it("can define a token group via the createToken utilities", function () {
            var A = (0, tokens_public_1.createToken)({
                name: "A",
                group: lexer_public_1.Lexer.SKIPPED
            });
            (0, chai_1.expect)(A).to.haveOwnProperty("GROUP");
            (0, chai_1.expect)(A.GROUP).to.equal(lexer_public_1.Lexer.SKIPPED);
        });
        it("Will throw when using the deprecated parent flag", function () {
            (0, chai_1.expect)(function () {
                return (0, tokens_public_1.createToken)({
                    name: "A",
                    parent: "oops"
                });
            }).to.throw("The parent property is no longer supported");
        });
        it("will not go into infinite loop due to cyclic categories", function () {
            var A = (0, tokens_public_1.createToken)({ name: "A" });
            var B = (0, tokens_public_1.createToken)({ name: "B", categories: [A] });
            (0, tokens_1.singleAssignCategoriesToksMap)([A], B);
        });
    });
});
//# sourceMappingURL=token_spec.js.map