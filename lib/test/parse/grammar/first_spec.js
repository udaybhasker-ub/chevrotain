"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var first_1 = require("../../../src/parse/grammar/first");
var matchers_1 = require("../../utils/matchers");
var gast_public_1 = require("../../../src/parse/grammar/gast/gast_public");
var chai_1 = require("chai");
var tokens_public_1 = require("../../../src/scan/tokens_public");
describe("The Grammar Ast first model", function () {
    it("can compute the first for a terminal", function () {
        var CommaTok = (0, tokens_public_1.createToken)({ name: "CommaTok", pattern: /NA/ });
        var EntityTok = (0, tokens_public_1.createToken)({ name: "EntityTok", pattern: /NA/ });
        var terminal = new gast_public_1.Terminal({ terminalType: EntityTok });
        var actual = (0, first_1.first)(terminal);
        (0, chai_1.expect)(actual.length).to.equal(1);
        (0, chai_1.expect)(actual[0]).to.equal(EntityTok);
        var terminal2 = new gast_public_1.Terminal({ terminalType: CommaTok });
        var actual2 = (0, first_1.first)(terminal2);
        (0, chai_1.expect)(actual2.length).to.equal(1);
        (0, chai_1.expect)(actual2[0]).to.equal(CommaTok);
    });
    it("can compute the first for a Sequence production ", function () {
        var EntityTok = (0, tokens_public_1.createToken)({ name: "EntityTok", pattern: /NA/ });
        var NamespaceTok = (0, tokens_public_1.createToken)({ name: "NamespaceTok", pattern: /NA/ });
        var seqProduction = new gast_public_1.Alternative({
            definition: [new gast_public_1.Terminal({ terminalType: EntityTok })]
        });
        var actual = (0, first_1.first)(seqProduction);
        (0, chai_1.expect)(actual.length).to.equal(1);
        (0, chai_1.expect)(actual[0]).to.equal(EntityTok);
        var seqProduction2 = new gast_public_1.Alternative({
            definition: [
                new gast_public_1.Terminal({ terminalType: EntityTok }),
                new gast_public_1.Option({
                    definition: [new gast_public_1.Terminal({ terminalType: NamespaceTok })]
                })
            ]
        });
        var actual2 = (0, first_1.first)(seqProduction2);
        (0, chai_1.expect)(actual2.length).to.equal(1);
        (0, chai_1.expect)(actual2[0]).to.equal(EntityTok);
    });
    it("can compute the first for an alternatives production ", function () {
        var EntityTok = (0, tokens_public_1.createToken)({ name: "EntityTok", pattern: /NA/ });
        var NamespaceTok = (0, tokens_public_1.createToken)({ name: "NamespaceTok", pattern: /NA/ });
        var TypeTok = (0, tokens_public_1.createToken)({ name: "TypeTok", pattern: /NA/ });
        var altProduction = new gast_public_1.Alternation({
            definition: [
                new gast_public_1.Alternative({
                    definition: [new gast_public_1.Terminal({ terminalType: EntityTok })]
                }),
                new gast_public_1.Alternative({
                    definition: [new gast_public_1.Terminal({ terminalType: NamespaceTok })]
                }),
                new gast_public_1.Alternative({
                    definition: [new gast_public_1.Terminal({ terminalType: TypeTok })]
                })
            ]
        });
        var actual = (0, first_1.first)(altProduction);
        (0, chai_1.expect)(actual.length).to.equal(3);
        (0, chai_1.expect)(actual[0]).to.equal(EntityTok);
        (0, chai_1.expect)(actual[1]).to.equal(NamespaceTok);
        (0, chai_1.expect)(actual[2]).to.equal(TypeTok);
    });
    it("can compute the first for an production with optional prefix", function () {
        var EntityTok = (0, tokens_public_1.createToken)({ name: "EntityTok", pattern: /NA/ });
        var NamespaceTok = (0, tokens_public_1.createToken)({ name: "NamespaceTok", pattern: /NA/ });
        var ConstTok = (0, tokens_public_1.createToken)({ name: "ConstTok", pattern: /NA/ });
        var ColonTok = (0, tokens_public_1.createToken)({ name: "ColonTok", pattern: /NA/ });
        var withOptionalPrefix = new gast_public_1.Alternative({
            definition: [
                new gast_public_1.Option({
                    definition: [new gast_public_1.Terminal({ terminalType: NamespaceTok })]
                }),
                new gast_public_1.Terminal({ terminalType: EntityTok })
            ]
        });
        var actual = (0, first_1.first)(withOptionalPrefix);
        (0, matchers_1.setEquality)(actual, [NamespaceTok, EntityTok]);
        var withTwoOptPrefix = new gast_public_1.Alternative({
            definition: [
                new gast_public_1.Option({
                    definition: [new gast_public_1.Terminal({ terminalType: NamespaceTok })]
                }),
                new gast_public_1.Option({
                    definition: [new gast_public_1.Terminal({ terminalType: ColonTok })]
                }),
                new gast_public_1.Terminal({ terminalType: EntityTok }),
                new gast_public_1.Option({
                    definition: [new gast_public_1.Terminal({ terminalType: ConstTok })]
                })
            ]
        });
        var actual2 = (0, first_1.first)(withTwoOptPrefix);
        (0, matchers_1.setEquality)(actual2, [NamespaceTok, ColonTok, EntityTok]);
    });
});
//# sourceMappingURL=first_spec.js.map