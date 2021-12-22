"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var follow_1 = require("../../../src/parse/grammar/follow");
var matchers_1 = require("../../utils/matchers");
var gast_public_1 = require("../../../src/parse/grammar/gast/gast_public");
var keys_1 = __importDefault(require("lodash/keys"));
var chai_1 = require("chai");
var tokens_public_1 = require("../../../src/scan/tokens_public");
var builders_1 = require("../../utils/builders");
var getIdentTok = (0, builders_1.createDeferredTokenBuilder)({
    name: "IdentTok",
    pattern: /NA/
});
var getDotTok = (0, builders_1.createDeferredTokenBuilder)({ name: "DotTok", pattern: /NA/ });
var getColonTok = (0, builders_1.createDeferredTokenBuilder)({
    name: "ColonTok",
    pattern: /NA/
});
function buildQualifiedName() {
    return new gast_public_1.Rule({
        name: "qualifiedName",
        definition: [
            new gast_public_1.Terminal({ terminalType: getIdentTok() }),
            new gast_public_1.Repetition({
                definition: [
                    new gast_public_1.Terminal({ terminalType: getDotTok() }),
                    new gast_public_1.Terminal({ terminalType: getIdentTok(), idx: 2 })
                ]
            })
        ]
    });
}
describe("The Grammar Ast Follows model", function () {
    var actionDec;
    var SemicolonTok;
    var CommaTok;
    var LParenTok = (0, tokens_public_1.createToken)({ name: "LParenTok", pattern: /NA/ });
    var RParenTok = (0, tokens_public_1.createToken)({ name: "RParenTok", pattern: /NA/ });
    before(function () {
        SemicolonTok = (0, tokens_public_1.createToken)({ name: "SemicolonTok", pattern: /NA/ });
        CommaTok = (0, tokens_public_1.createToken)({ name: "CommaTok", pattern: /NA/ });
        LParenTok = (0, tokens_public_1.createToken)({ name: "LParenTok", pattern: /NA/ });
        RParenTok = (0, tokens_public_1.createToken)({ name: "RParenTok", pattern: /NA/ });
        var LSquareTok = (0, tokens_public_1.createToken)({ name: "LSquareTok", pattern: /NA/ });
        var RSquareTok = (0, tokens_public_1.createToken)({ name: "RSquareTok", pattern: /NA/ });
        var paramSpec = new gast_public_1.Rule({
            name: "paramSpec",
            definition: [
                new gast_public_1.Terminal({ terminalType: getIdentTok() }),
                new gast_public_1.Terminal({ terminalType: getColonTok() }),
                new gast_public_1.NonTerminal({
                    nonTerminalName: "qualifiedName",
                    referencedRule: buildQualifiedName()
                }),
                new gast_public_1.Option({
                    definition: [
                        new gast_public_1.Terminal({ terminalType: LSquareTok }),
                        new gast_public_1.Terminal({ terminalType: RSquareTok })
                    ]
                })
            ]
        });
        var ActionTok = (0, tokens_public_1.createToken)({ name: "ActionTok", pattern: /NA/ });
        actionDec = new gast_public_1.Rule({
            name: "actionDec",
            definition: [
                new gast_public_1.Terminal({ terminalType: ActionTok }),
                new gast_public_1.Terminal({ terminalType: getIdentTok() }),
                new gast_public_1.Terminal({ terminalType: LParenTok }),
                new gast_public_1.Option({
                    definition: [
                        new gast_public_1.NonTerminal({
                            nonTerminalName: "paramSpec",
                            referencedRule: paramSpec
                        }),
                        new gast_public_1.Repetition({
                            definition: [
                                new gast_public_1.Terminal({ terminalType: CommaTok }),
                                new gast_public_1.NonTerminal({
                                    nonTerminalName: "paramSpec",
                                    referencedRule: paramSpec,
                                    idx: 2
                                })
                            ]
                        })
                    ]
                }),
                new gast_public_1.Terminal({ terminalType: RParenTok }),
                new gast_public_1.Option({
                    definition: [
                        new gast_public_1.Terminal({ terminalType: getColonTok() }),
                        new gast_public_1.NonTerminal({
                            nonTerminalName: "qualifiedName",
                            referencedRule: buildQualifiedName()
                        })
                    ],
                    idx: 2
                }),
                new gast_public_1.Terminal({ terminalType: SemicolonTok })
            ]
        });
    });
    it("can build a followNamePrefix from a Terminal", function () {
        var EntityTok = (0, tokens_public_1.createToken)({ name: "EntityTok", pattern: /NA/ });
        var terminal = new gast_public_1.Terminal({ terminalType: getIdentTok() });
        var actual = (0, follow_1.buildInProdFollowPrefix)(terminal);
        (0, chai_1.expect)(actual).to.equal("IdentTok1_~IN~_");
        var terminal2 = new gast_public_1.Terminal({ terminalType: EntityTok });
        terminal2.idx = 3;
        var actual2 = (0, follow_1.buildInProdFollowPrefix)(terminal2);
        (0, chai_1.expect)(actual2).to.equal("EntityTok3_~IN~_");
    });
    it("can build a followName prefix from a TopLevel Production and index", function () {
        var prod = new gast_public_1.Rule({ name: "bamba", definition: [] });
        var index = 5;
        var actual = (0, follow_1.buildBetweenProdsFollowPrefix)(prod, index);
        (0, chai_1.expect)(actual).to.equal("bamba5_~IN~_");
    });
    it("can compute the follows for Top level production ref in ActionDec", function () {
        var actual = new follow_1.ResyncFollowsWalker(actionDec).startWalking();
        var actualFollowNames = (0, keys_1.default)(actual);
        (0, chai_1.expect)(actualFollowNames.length).to.equal(3);
        (0, chai_1.expect)(actual["paramSpec1_~IN~_actionDec"].length).to.equal(2);
        (0, matchers_1.setEquality)(actual["paramSpec1_~IN~_actionDec"], [CommaTok, RParenTok]);
        (0, chai_1.expect)(actual["paramSpec2_~IN~_actionDec"].length).to.equal(2);
        (0, matchers_1.setEquality)(actual["paramSpec1_~IN~_actionDec"], [CommaTok, RParenTok]);
        (0, chai_1.expect)(actual["qualifiedName1_~IN~_actionDec"].length).to.equal(1);
        (0, matchers_1.setEquality)(actual["qualifiedName1_~IN~_actionDec"], [SemicolonTok]);
    });
    it("can compute all follows for a set of top level productions", function () {
        var actual = (0, follow_1.computeAllProdsFollows)([actionDec]);
        (0, chai_1.expect)((0, keys_1.default)(actual).length).to.equal(3);
    });
});
//# sourceMappingURL=follow_spec.js.map