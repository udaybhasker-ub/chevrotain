"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("../../../src/parse/parser/parser");
var tokens_public_1 = require("../../../src/scan/tokens_public");
var lookahead_1 = require("../../../src/parse/grammar/lookahead");
var map_1 = __importDefault(require("lodash/map"));
var tokens_1 = require("../../../src/scan/tokens");
var matchers_1 = require("../../utils/matchers");
var gast_public_1 = require("../../../src/parse/grammar/gast/gast_public");
var parser_traits_1 = require("../../../src/parse/parser/traits/parser_traits");
var chai_1 = require("chai");
describe("getProdType", function () {
    it("handles `Option`", function () {
        (0, chai_1.expect)((0, lookahead_1.getProdType)(new gast_public_1.Option({ definition: [] }))).to.equal(lookahead_1.PROD_TYPE.OPTION);
    });
    it("handles `Repetition`", function () {
        (0, chai_1.expect)((0, lookahead_1.getProdType)(new gast_public_1.Repetition({ definition: [] }))).to.equal(lookahead_1.PROD_TYPE.REPETITION);
    });
    it("handles `RepetitionMandatory`", function () {
        (0, chai_1.expect)((0, lookahead_1.getProdType)(new gast_public_1.RepetitionMandatory({ definition: [] }))).to.equal(lookahead_1.PROD_TYPE.REPETITION_MANDATORY);
    });
    it("handles `RepetitionWithSeparator`", function () {
        (0, chai_1.expect)((0, lookahead_1.getProdType)(new gast_public_1.RepetitionWithSeparator({
            definition: [],
            separator: (0, tokens_public_1.createToken)({ name: "Comma" })
        }))).to.equal(lookahead_1.PROD_TYPE.REPETITION_WITH_SEPARATOR);
    });
    it("handles `RepetitionMandatoryWithSeparator`", function () {
        (0, chai_1.expect)((0, lookahead_1.getProdType)(new gast_public_1.RepetitionMandatoryWithSeparator({
            definition: [],
            separator: (0, tokens_public_1.createToken)({ name: "Comma" })
        }))).to.equal(lookahead_1.PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR);
    });
    it("handles `Alternation`", function () {
        (0, chai_1.expect)((0, lookahead_1.getProdType)(new gast_public_1.Alternation({ definition: [] }))).to.equal(lookahead_1.PROD_TYPE.ALTERNATION);
    });
});
context("lookahead specs", function () {
    var ColonParserMockVar;
    var IdentParserMockVar;
    var CommaParserMockVar;
    var KeyParserMockVar;
    var EntityParserMockVar;
    var actionDec;
    var lotsOfOrs;
    var emptyAltOr;
    before(function () {
        var IdentTok = (0, tokens_public_1.createToken)({ name: "IdentTok" });
        var DotTok = (0, tokens_public_1.createToken)({ name: "DotTok" });
        var ColonTok = (0, tokens_public_1.createToken)({ name: "ColonTok" });
        var LSquareTok = (0, tokens_public_1.createToken)({ name: "LSquareTok" });
        var RSquareTok = (0, tokens_public_1.createToken)({ name: "RSquareTok" });
        var ActionTok = (0, tokens_public_1.createToken)({ name: "ActionTok" });
        var LParenTok = (0, tokens_public_1.createToken)({ name: "LParenTok" });
        var RParenTok = (0, tokens_public_1.createToken)({ name: "RParenTok" });
        var CommaTok = (0, tokens_public_1.createToken)({ name: "CommaTok" });
        var SemicolonTok = (0, tokens_public_1.createToken)({ name: "SemicolonTok" });
        var EntityTok = (0, tokens_public_1.createToken)({ name: "EntityTok" });
        var KeyTok = (0, tokens_public_1.createToken)({ name: "KeyTok" });
        var qualifiedName = new gast_public_1.Rule({
            name: "qualifiedName",
            definition: [
                new gast_public_1.Terminal({ terminalType: IdentTok }),
                new gast_public_1.Repetition({
                    definition: [
                        new gast_public_1.Terminal({ terminalType: DotTok }),
                        new gast_public_1.Terminal({ terminalType: IdentTok, idx: 2 })
                    ]
                })
            ]
        });
        var paramSpec = new gast_public_1.Rule({
            name: "paramSpec",
            definition: [
                new gast_public_1.Terminal({ terminalType: IdentTok }),
                new gast_public_1.Terminal({ terminalType: ColonTok }),
                new gast_public_1.NonTerminal({
                    nonTerminalName: "qualifiedName",
                    referencedRule: qualifiedName
                }),
                new gast_public_1.Option({
                    definition: [
                        new gast_public_1.Terminal({ terminalType: LSquareTok }),
                        new gast_public_1.Terminal({ terminalType: RSquareTok })
                    ]
                })
            ]
        });
        actionDec = new gast_public_1.Rule({
            name: "actionDec",
            definition: [
                new gast_public_1.Terminal({ terminalType: ActionTok }),
                new gast_public_1.Terminal({ terminalType: IdentTok }),
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
                        new gast_public_1.Terminal({ terminalType: ColonTok }),
                        new gast_public_1.NonTerminal({
                            nonTerminalName: "qualifiedName",
                            referencedRule: qualifiedName
                        })
                    ],
                    idx: 2
                }),
                new gast_public_1.Terminal({ terminalType: SemicolonTok })
            ]
        });
        lotsOfOrs = new gast_public_1.Rule({
            name: "lotsOfOrs",
            definition: [
                new gast_public_1.Alternation({
                    definition: [
                        new gast_public_1.Alternative({
                            definition: [
                                new gast_public_1.Alternation({
                                    definition: [
                                        new gast_public_1.Alternative({
                                            definition: [
                                                new gast_public_1.Terminal({
                                                    terminalType: CommaTok,
                                                    idx: 1
                                                })
                                            ]
                                        }),
                                        new gast_public_1.Alternative({
                                            definition: [
                                                new gast_public_1.Terminal({
                                                    terminalType: KeyTok,
                                                    idx: 1
                                                })
                                            ]
                                        })
                                    ],
                                    idx: 2
                                })
                            ]
                        }),
                        new gast_public_1.Alternative({
                            definition: [
                                new gast_public_1.Terminal({
                                    terminalType: EntityTok,
                                    idx: 1
                                })
                            ]
                        })
                    ]
                }),
                new gast_public_1.Alternation({
                    definition: [
                        new gast_public_1.Alternative({
                            definition: [
                                new gast_public_1.Terminal({
                                    terminalType: DotTok,
                                    idx: 1
                                })
                            ]
                        })
                    ],
                    idx: 3
                })
            ]
        });
        emptyAltOr = new gast_public_1.Rule({
            name: "emptyAltOr",
            definition: [
                new gast_public_1.Alternation({
                    definition: [
                        new gast_public_1.Alternative({
                            definition: [
                                new gast_public_1.Terminal({
                                    terminalType: KeyTok,
                                    idx: 1
                                })
                            ]
                        }),
                        new gast_public_1.Alternative({
                            definition: [
                                new gast_public_1.Terminal({
                                    terminalType: EntityTok,
                                    idx: 1
                                })
                            ]
                        }),
                        new gast_public_1.Alternative({ definition: [] }) // an empty alternative
                    ]
                })
            ]
        });
        var ColonParserMock = /** @class */ (function (_super) {
            __extends(ColonParserMock, _super);
            function ColonParserMock() {
                return _super.call(this, [ColonTok]) || this;
            }
            ColonParserMock.prototype.LA = function () {
                return (0, matchers_1.createRegularToken)(ColonTok, ":");
            };
            return ColonParserMock;
        }(parser_traits_1.EmbeddedActionsParser));
        ColonParserMockVar = ColonParserMock;
        var IdentParserMock = /** @class */ (function (_super) {
            __extends(IdentParserMock, _super);
            function IdentParserMock() {
                return _super.call(this, [IdentTok]) || this;
            }
            IdentParserMock.prototype.LA = function () {
                return (0, matchers_1.createRegularToken)(IdentTok, "bamba");
            };
            return IdentParserMock;
        }(parser_traits_1.EmbeddedActionsParser));
        IdentParserMockVar = IdentParserMock;
        var CommaParserMock = /** @class */ (function (_super) {
            __extends(CommaParserMock, _super);
            function CommaParserMock() {
                return _super.call(this, [CommaTok]) || this;
            }
            CommaParserMock.prototype.LA = function () {
                return (0, matchers_1.createRegularToken)(CommaTok, ",");
            };
            return CommaParserMock;
        }(parser_traits_1.EmbeddedActionsParser));
        CommaParserMockVar = CommaParserMock;
        var EntityParserMock = /** @class */ (function (_super) {
            __extends(EntityParserMock, _super);
            function EntityParserMock() {
                return _super.call(this, [EntityTok]) || this;
            }
            EntityParserMock.prototype.LA = function () {
                return (0, matchers_1.createRegularToken)(EntityTok, ",");
            };
            return EntityParserMock;
        }(parser_traits_1.EmbeddedActionsParser));
        EntityParserMockVar = EntityParserMock;
        var KeyParserMock = /** @class */ (function (_super) {
            __extends(KeyParserMock, _super);
            function KeyParserMock() {
                return _super.call(this, [KeyTok]) || this;
            }
            KeyParserMock.prototype.LA = function () {
                return (0, matchers_1.createRegularToken)(KeyTok, ",");
            };
            return KeyParserMock;
        }(parser_traits_1.EmbeddedActionsParser));
        KeyParserMockVar = KeyParserMock;
    });
    describe("The Grammar Lookahead namespace", function () {
        it("can compute the lookahead function for the first OPTION in ActionDec", function () {
            var colonMock = new ColonParserMockVar();
            var indentMock = new IdentParserMockVar();
            var laFunc = (0, lookahead_1.buildLookaheadFuncForOptionalProd)(1, actionDec, 1, false, lookahead_1.PROD_TYPE.OPTION, lookahead_1.buildSingleAlternativeLookaheadFunction);
            (0, chai_1.expect)(laFunc.call(colonMock)).to.equal(false);
            (0, chai_1.expect)(laFunc.call(indentMock)).to.equal(true);
        });
        it("can compute the lookahead function for the second OPTION in ActionDec", function () {
            var colonParserMock = new ColonParserMockVar();
            var identParserMock = new IdentParserMockVar();
            var laFunc = (0, lookahead_1.buildLookaheadFuncForOptionalProd)(2, actionDec, 1, false, lookahead_1.PROD_TYPE.OPTION, lookahead_1.buildSingleAlternativeLookaheadFunction);
            (0, chai_1.expect)(laFunc.call(colonParserMock)).to.equal(true);
            (0, chai_1.expect)(laFunc.call(identParserMock)).to.equal(false);
        });
        it("can compute the lookahead function for OPTION with categories", function () {
            var B = (0, tokens_public_1.createToken)({ name: "B" });
            var C = (0, tokens_public_1.createToken)({ name: "C", categories: [B] });
            var optionRule = new gast_public_1.Rule({
                name: "optionRule",
                definition: [
                    new gast_public_1.Option({
                        definition: [
                            new gast_public_1.Terminal({
                                terminalType: B,
                                idx: 1
                            })
                        ]
                    })
                ]
            });
            var laFunc = (0, lookahead_1.buildLookaheadFuncForOptionalProd)(1, optionRule, 1, false, lookahead_1.PROD_TYPE.OPTION, lookahead_1.buildSingleAlternativeLookaheadFunction);
            var laMock = {
                LA: function () {
                    return (0, matchers_1.createRegularToken)(C, "c");
                }
            };
            // C can match B (2nd alternative) due to its categories definition
            (0, chai_1.expect)(laFunc.call(laMock)).to.be.true;
        });
        it("can compute the lookahead function for the first MANY in ActionDec", function () {
            var identParserMock = new IdentParserMockVar();
            var commaParserMock = new CommaParserMockVar();
            var laFunc = (0, lookahead_1.buildLookaheadFuncForOptionalProd)(1, actionDec, 1, false, lookahead_1.PROD_TYPE.REPETITION, lookahead_1.buildSingleAlternativeLookaheadFunction);
            (0, chai_1.expect)(laFunc.call(commaParserMock)).to.equal(true);
            (0, chai_1.expect)(laFunc.call(identParserMock)).to.equal(false);
        });
        it("can compute the lookahead function for lots of ORs sample", function () {
            var keyParserMock = new KeyParserMockVar();
            var entityParserMock = new EntityParserMockVar();
            var colonParserMock = new ColonParserMockVar();
            var commaParserMock = new CommaParserMockVar();
            var laFunc = (0, lookahead_1.buildLookaheadFuncForOr)(1, lotsOfOrs, 1, false, false, lookahead_1.buildAlternativesLookAheadFunc);
            (0, chai_1.expect)(laFunc.call(commaParserMock)).to.equal(0);
            (0, chai_1.expect)(laFunc.call(keyParserMock)).to.equal(0);
            (0, chai_1.expect)(laFunc.call(entityParserMock)).to.equal(1);
            (0, chai_1.expect)(laFunc.call(colonParserMock)).to.equal(undefined);
        });
        it("can compute the lookahead function for OR using categories", function () {
            var A = (0, tokens_public_1.createToken)({ name: "A" });
            var B = (0, tokens_public_1.createToken)({ name: "B" });
            var C = (0, tokens_public_1.createToken)({ name: "C", categories: [B] });
            var orRule = new gast_public_1.Rule({
                name: "orRule",
                definition: [
                    new gast_public_1.Alternation({
                        definition: [
                            new gast_public_1.Alternative({
                                definition: [
                                    new gast_public_1.Terminal({
                                        terminalType: A,
                                        idx: 1
                                    })
                                ]
                            }),
                            new gast_public_1.Alternative({
                                definition: [
                                    new gast_public_1.Terminal({
                                        terminalType: B,
                                        idx: 1
                                    })
                                ]
                            })
                        ]
                    })
                ]
            });
            var laFunc = (0, lookahead_1.buildLookaheadFuncForOr)(1, orRule, 1, false, false, lookahead_1.buildAlternativesLookAheadFunc);
            var laMock = {
                LA: function () {
                    return (0, matchers_1.createRegularToken)(C, "c");
                }
            };
            // C can match B (2nd alternative) due to its categories definition
            (0, chai_1.expect)(laFunc.call(laMock)).to.equal(1);
        });
        it("can compute the lookahead function for EMPTY OR sample", function () {
            var commaParserMock = new CommaParserMockVar();
            var keyParserMock = new KeyParserMockVar();
            var entityParserMock = new EntityParserMockVar();
            var laFunc = (0, lookahead_1.buildLookaheadFuncForOr)(1, emptyAltOr, 1, false, false, lookahead_1.buildAlternativesLookAheadFunc);
            (0, chai_1.expect)(laFunc.call(keyParserMock)).to.equal(0);
            (0, chai_1.expect)(laFunc.call(entityParserMock)).to.equal(1);
            // none matches so the last empty alternative should be taken (idx 2)
            (0, chai_1.expect)(laFunc.call(commaParserMock)).to.equal(2);
        });
    });
    describe("The chevrotain grammar lookahead capabilities", function () {
        var Alpha;
        var ExtendsAlpha;
        var ExtendsAlphaAlpha;
        var Beta;
        var Charlie;
        var Delta;
        var Gamma;
        before(function () {
            Alpha = (0, tokens_public_1.createToken)({ name: "Alpha" });
            ExtendsAlpha = (0, tokens_public_1.createToken)({
                name: "ExtendsAlpha",
                categories: Alpha
            });
            ExtendsAlphaAlpha = (0, tokens_public_1.createToken)({
                name: "ExtendsAlphaAlpha",
                categories: ExtendsAlpha
            });
            Beta = (0, tokens_public_1.createToken)({ name: "Beta" });
            Charlie = (0, tokens_public_1.createToken)({ name: "Charlie" });
            Delta = (0, tokens_public_1.createToken)({ name: "Delta" });
            Gamma = (0, tokens_public_1.createToken)({ name: "Gamma" });
            (0, tokens_1.augmentTokenTypes)([Alpha, Beta, Delta, Gamma, Charlie, ExtendsAlphaAlpha]);
        });
        context("computing lookahead sequences for", function () {
            it("two simple one token alternatives", function () {
                var alt1 = new gast_public_1.Alternation({
                    definition: [
                        new gast_public_1.Alternative({
                            definition: [new gast_public_1.Terminal({ terminalType: Alpha })]
                        }),
                        new gast_public_1.Alternative({
                            definition: [new gast_public_1.Terminal({ terminalType: Beta })]
                        }),
                        new gast_public_1.Alternative({
                            definition: [new gast_public_1.Terminal({ terminalType: Beta })]
                        })
                    ]
                });
                var alt2 = new gast_public_1.Terminal({ terminalType: Gamma });
                var actual = (0, lookahead_1.lookAheadSequenceFromAlternatives)([alt1, alt2], 5);
                (0, chai_1.expect)(actual).to.deep.equal([[[Alpha], [Beta]], [[Gamma]]]);
            });
            it("three simple one token alternatives", function () {
                var alt1 = new gast_public_1.Alternation({
                    definition: [
                        new gast_public_1.Alternative({
                            definition: [new gast_public_1.Terminal({ terminalType: Alpha })]
                        }),
                        new gast_public_1.Alternative({
                            definition: [new gast_public_1.Terminal({ terminalType: Beta })]
                        }),
                        new gast_public_1.Alternative({
                            definition: [new gast_public_1.Terminal({ terminalType: Beta })]
                        })
                    ]
                });
                var alt2 = new gast_public_1.Terminal({ terminalType: Gamma });
                var alt3 = new gast_public_1.Alternative({
                    definition: [
                        new gast_public_1.Terminal({ terminalType: Delta }),
                        new gast_public_1.Terminal({ terminalType: Charlie })
                    ]
                });
                var actual = (0, lookahead_1.lookAheadSequenceFromAlternatives)([alt1, alt2, alt3], 5);
                (0, chai_1.expect)(actual).to.deep.equal([[[Alpha], [Beta]], [[Gamma]], [[Delta]]]);
            });
            it("two complex multi token alternatives", function () {
                var alt1 = new gast_public_1.Alternation({
                    definition: [
                        new gast_public_1.Alternative({
                            definition: [
                                new gast_public_1.Terminal({ terminalType: Alpha }),
                                new gast_public_1.Terminal({ terminalType: Beta })
                            ]
                        }),
                        new gast_public_1.Alternative({
                            definition: [new gast_public_1.Terminal({ terminalType: Beta })]
                        }),
                        new gast_public_1.Alternative({
                            definition: [
                                new gast_public_1.Terminal({ terminalType: Alpha }),
                                new gast_public_1.Terminal({ terminalType: Gamma }),
                                new gast_public_1.Terminal({ terminalType: Delta })
                            ]
                        })
                    ]
                });
                var alt2 = new gast_public_1.Alternation({
                    definition: [
                        new gast_public_1.Alternative({
                            definition: [
                                new gast_public_1.Terminal({ terminalType: Alpha }),
                                new gast_public_1.Terminal({ terminalType: Delta })
                            ]
                        }),
                        new gast_public_1.Alternative({
                            definition: [new gast_public_1.Terminal({ terminalType: Charlie })]
                        })
                    ]
                });
                var actual = (0, lookahead_1.lookAheadSequenceFromAlternatives)([alt1, alt2], 5);
                (0, chai_1.expect)(actual).to.deep.equal([
                    [[Beta], [Alpha, Beta], [Alpha, Gamma]],
                    [[Charlie], [Alpha, Delta]]
                ]);
            });
            it("three complex multi token alternatives", function () {
                var alt1 = new gast_public_1.Alternation({
                    definition: [
                        new gast_public_1.Alternative({
                            definition: [
                                new gast_public_1.Terminal({ terminalType: Alpha }),
                                new gast_public_1.Terminal({ terminalType: Beta }),
                                new gast_public_1.Terminal({ terminalType: Gamma })
                            ]
                        }),
                        new gast_public_1.Alternative({
                            definition: [new gast_public_1.Terminal({ terminalType: Beta })]
                        })
                    ]
                });
                var alt2 = new gast_public_1.Alternation({
                    definition: [
                        new gast_public_1.Alternative({
                            definition: [
                                new gast_public_1.Terminal({ terminalType: Alpha }),
                                new gast_public_1.Terminal({ terminalType: Delta })
                            ]
                        }),
                        new gast_public_1.Alternative({
                            definition: [new gast_public_1.Terminal({ terminalType: Charlie })]
                        }),
                        new gast_public_1.Alternative({
                            definition: [
                                new gast_public_1.Terminal({ terminalType: Gamma }),
                                new gast_public_1.Terminal({ terminalType: Gamma })
                            ]
                        })
                    ]
                });
                var alt3 = new gast_public_1.Alternation({
                    definition: [
                        new gast_public_1.Alternative({
                            definition: [
                                new gast_public_1.Terminal({ terminalType: Alpha }),
                                new gast_public_1.Terminal({ terminalType: Beta }),
                                new gast_public_1.Terminal({ terminalType: Delta })
                            ]
                        }),
                        new gast_public_1.Alternative({
                            definition: [
                                new gast_public_1.Terminal({ terminalType: Charlie }),
                                new gast_public_1.Terminal({ terminalType: Beta })
                            ]
                        })
                    ]
                });
                var actual = (0, lookahead_1.lookAheadSequenceFromAlternatives)([alt1, alt2, alt3], 5);
                (0, chai_1.expect)(actual).to.deep.equal([
                    [[Beta], [Alpha, Beta, Gamma]],
                    [[Charlie], [Gamma], [Alpha, Delta]],
                    [
                        [Charlie, Beta],
                        [Alpha, Beta, Delta]
                    ]
                ]);
            });
            it("two complex multi token alternatives with shared prefix", function () {
                var alt1 = new gast_public_1.Alternative({
                    definition: [
                        new gast_public_1.Terminal({ terminalType: Alpha }),
                        new gast_public_1.Terminal({ terminalType: Beta }),
                        new gast_public_1.Terminal({ terminalType: Charlie }),
                        new gast_public_1.Terminal({ terminalType: Delta })
                    ]
                });
                var alt2 = new gast_public_1.Alternative({
                    definition: [
                        new gast_public_1.Terminal({ terminalType: Alpha }),
                        new gast_public_1.Terminal({ terminalType: Beta }),
                        new gast_public_1.Terminal({ terminalType: Charlie }),
                        new gast_public_1.Terminal({ terminalType: Delta }),
                        new gast_public_1.Terminal({ terminalType: Gamma }),
                        new gast_public_1.Terminal({ terminalType: Alpha })
                    ]
                });
                var actual = (0, lookahead_1.lookAheadSequenceFromAlternatives)([alt1, alt2], 5);
                (0, chai_1.expect)(actual).to.deep.equal([
                    [[Alpha, Beta, Charlie, Delta]],
                    [[Alpha, Beta, Charlie, Delta, Gamma]]
                ]);
            });
            it("simple ambiguous alternatives", function () {
                var alt1 = new gast_public_1.Alternative({
                    definition: [new gast_public_1.Terminal({ terminalType: Alpha })]
                });
                var alt2 = new gast_public_1.Alternative({
                    definition: [new gast_public_1.Terminal({ terminalType: Alpha })]
                });
                var actual = (0, lookahead_1.lookAheadSequenceFromAlternatives)([alt1, alt2], 5);
                (0, chai_1.expect)(actual).to.deep.equal([[[Alpha]], [[Alpha]]]);
            });
            it("complex(multi-token) ambiguous alternatives", function () {
                var alt1 = new gast_public_1.Alternative({
                    definition: [
                        new gast_public_1.Terminal({ terminalType: Alpha }),
                        new gast_public_1.Terminal({ terminalType: Beta }),
                        new gast_public_1.Terminal({ terminalType: Charlie })
                    ]
                });
                var alt2 = new gast_public_1.Alternative({
                    definition: [
                        new gast_public_1.Terminal({ terminalType: Alpha }),
                        new gast_public_1.Terminal({ terminalType: Beta }),
                        new gast_public_1.Terminal({ terminalType: Charlie })
                    ]
                });
                var actual = (0, lookahead_1.lookAheadSequenceFromAlternatives)([alt1, alt2], 5);
                (0, chai_1.expect)(actual).to.deep.equal([
                    [[Alpha, Beta, Charlie]],
                    [[Alpha, Beta, Charlie]]
                ]);
            });
        });
        context("computing lookahead functions for", function () {
            var MockParser = /** @class */ (function () {
                function MockParser(inputConstructors) {
                    this.inputConstructors = inputConstructors;
                    this.input = (0, map_1.default)(inputConstructors, function (currConst) {
                        return (0, matchers_1.createRegularToken)(currConst);
                    });
                }
                MockParser.prototype.LA = function (howMuch) {
                    if (this.input.length <= howMuch - 1) {
                        return parser_1.END_OF_FILE;
                    }
                    else {
                        return this.input[howMuch - 1];
                    }
                };
                return MockParser;
            }());
            it("inheritance Alternative alternatives - positive", function () {
                var alternatives = [
                    [[ExtendsAlphaAlpha]],
                    [[ExtendsAlpha]],
                    [[Alpha]] // 2
                ];
                var laFunc = (0, lookahead_1.buildAlternativesLookAheadFunc)(alternatives, false, tokens_1.tokenStructuredMatcher, false);
                (0, chai_1.expect)(laFunc.call(new MockParser([Alpha]))).to.equal(2);
                (0, chai_1.expect)(laFunc.call(new MockParser([ExtendsAlpha]))).to.equal(1);
                (0, chai_1.expect)(laFunc.call(new MockParser([ExtendsAlphaAlpha]))).to.equal(0);
            });
            it("simple alternatives - positive", function () {
                var alternatives = [
                    [[Alpha], [Beta]],
                    [[Delta], [Gamma]],
                    [[Charlie]] // 2
                ];
                var laFunc = (0, lookahead_1.buildAlternativesLookAheadFunc)(alternatives, false, tokens_1.tokenStructuredMatcher, false);
                (0, chai_1.expect)(laFunc.call(new MockParser([Alpha]))).to.equal(0);
                (0, chai_1.expect)(laFunc.call(new MockParser([Beta]))).to.equal(0);
                (0, chai_1.expect)(laFunc.call(new MockParser([Delta]))).to.equal(1);
                (0, chai_1.expect)(laFunc.call(new MockParser([Gamma]))).to.equal(1);
                (0, chai_1.expect)(laFunc.call(new MockParser([Charlie]))).to.equal(2);
            });
            it("simple alternatives - negative", function () {
                var alternatives = [
                    [[Alpha], [Beta]],
                    [[Delta], [Gamma]] // 1
                ];
                var laFunc = (0, lookahead_1.buildAlternativesLookAheadFunc)(alternatives, false, tokens_1.tokenStructuredMatcher, false);
                (0, chai_1.expect)(laFunc.call(new MockParser([]))).to.be.undefined;
                (0, chai_1.expect)(laFunc.call(new MockParser([Charlie]))).to.be.undefined;
            });
            it("complex alternatives - positive", function () {
                var alternatives = [
                    [
                        [Alpha, Beta, Gamma],
                        [Alpha, Beta, Delta]
                    ],
                    [[Alpha, Beta, Beta]],
                    [[Alpha, Beta]] // 2 - Prefix of '1' alternative
                ];
                var laFunc = (0, lookahead_1.buildAlternativesLookAheadFunc)(alternatives, false, tokens_1.tokenStructuredMatcher, false);
                (0, chai_1.expect)(laFunc.call(new MockParser([Alpha, Beta, Gamma]))).to.equal(0);
                (0, chai_1.expect)(laFunc.call(new MockParser([Alpha, Beta, Gamma, Delta]))).to.equal(0);
                (0, chai_1.expect)(laFunc.call(new MockParser([Alpha, Beta, Delta]))).to.equal(0);
                (0, chai_1.expect)(laFunc.call(new MockParser([Alpha, Beta, Beta]))).to.equal(1);
                (0, chai_1.expect)(laFunc.call(new MockParser([Alpha, Beta, Charlie]))).to.equal(2);
            });
            it("complex alternatives - negative", function () {
                var alternatives = [
                    [
                        [Alpha, Beta, Gamma],
                        [Alpha, Beta, Delta]
                    ],
                    [[Alpha, Beta, Beta]],
                    [[Alpha, Beta], [Gamma]] // 2
                ];
                var laFunc = (0, lookahead_1.buildAlternativesLookAheadFunc)(alternatives, false, tokens_1.tokenStructuredMatcher, false);
                (0, chai_1.expect)(laFunc.call(new MockParser([]))).to.be.undefined;
                (0, chai_1.expect)(laFunc.call(new MockParser([Alpha, Gamma, Gamma]))).to.be
                    .undefined;
                (0, chai_1.expect)(laFunc.call(new MockParser([Charlie]))).to.be.undefined;
                (0, chai_1.expect)(laFunc.call(new MockParser([Beta, Alpha, Beta, Gamma]))).to.be
                    .undefined;
            });
            it("complex alternatives with inheritance - positive", function () {
                var alternatives = [
                    [[ExtendsAlpha, Beta]],
                    [[Alpha, Beta]] // 1
                ];
                var laFunc = (0, lookahead_1.buildAlternativesLookAheadFunc)(alternatives, false, tokens_1.tokenStructuredMatcher, false);
                (0, chai_1.expect)(laFunc.call(new MockParser([Alpha, Beta]))).to.equal(1);
                (0, chai_1.expect)(laFunc.call(new MockParser([ExtendsAlphaAlpha, Beta]))).to.equal(0);
                // expect(
                //     laFunc.call(new MockParser([ExtendsAlpha, Beta]))
                // ).to.equal(0)
            });
            it("complex alternatives with inheritance - negative", function () {
                var alternatives = [
                    [[ExtendsAlpha, Beta]],
                    [[Alpha, Gamma]] // 1
                ];
                var laFunc = (0, lookahead_1.buildAlternativesLookAheadFunc)(alternatives, false, tokens_1.tokenStructuredMatcher, false);
                (0, chai_1.expect)(laFunc.call(new MockParser([Alpha, Beta]))).to.be.undefined;
                (0, chai_1.expect)(laFunc.call(new MockParser([ExtendsAlphaAlpha, Delta]))).to.be
                    .undefined;
            });
            it("Empty alternatives", function () {
                var alternatives = [
                    [[Alpha]],
                    [[]] // 1
                ];
                var laFunc = (0, lookahead_1.buildAlternativesLookAheadFunc)(alternatives, false, tokens_1.tokenStructuredMatcher, false);
                (0, chai_1.expect)(laFunc.call(new MockParser([Alpha]))).to.equal(0);
                (0, chai_1.expect)(laFunc.call(new MockParser([]))).to.equal(1); // empty alternative always matches
                (0, chai_1.expect)(laFunc.call(new MockParser([Delta]))).to.equal(1); // empty alternative always matches
            });
            it("simple optional - positive", function () {
                var alternative = [[Alpha], [Beta], [Charlie]];
                var laFunc = (0, lookahead_1.buildSingleAlternativeLookaheadFunction)(alternative, tokens_1.tokenStructuredMatcher, false);
                (0, chai_1.expect)(laFunc.call(new MockParser([Alpha]))).to.be.true;
                (0, chai_1.expect)(laFunc.call(new MockParser([Beta]))).to.be.true;
                (0, chai_1.expect)(laFunc.call(new MockParser([Charlie]))).to.be.true;
            });
            it("simple optional - negative", function () {
                var alternative = [[Alpha], [Beta], [Charlie]];
                var laFunc = (0, lookahead_1.buildSingleAlternativeLookaheadFunction)(alternative, tokens_1.tokenStructuredMatcher, false);
                (0, chai_1.expect)(laFunc.call(new MockParser([Delta]))).to.be.false;
                (0, chai_1.expect)(laFunc.call(new MockParser([Gamma]))).to.be.false;
            });
            it("complex optional - positive", function () {
                var alternative = [[Alpha, Beta, Gamma], [Beta], [Charlie, Delta]];
                var laFunc = (0, lookahead_1.buildSingleAlternativeLookaheadFunction)(alternative, tokens_1.tokenStructuredMatcher, false);
                (0, chai_1.expect)(laFunc.call(new MockParser([Alpha, Beta, Gamma]))).to.be.true;
                (0, chai_1.expect)(laFunc.call(new MockParser([Beta]))).to.be.true;
                (0, chai_1.expect)(laFunc.call(new MockParser([Charlie, Delta]))).to.be.true;
            });
            it("complex optional - Negative", function () {
                var alternative = [[Alpha, Beta, Gamma], [Beta], [Charlie, Delta]];
                var laFunc = (0, lookahead_1.buildSingleAlternativeLookaheadFunction)(alternative, tokens_1.tokenStructuredMatcher, false);
                (0, chai_1.expect)(laFunc.call(new MockParser([Alpha, Charlie, Gamma]))).to.be.false;
                (0, chai_1.expect)(laFunc.call(new MockParser([Charlie]))).to.be.false;
                (0, chai_1.expect)(laFunc.call(new MockParser([Charlie, Beta]))).to.be.false;
            });
            it("complex optional with inheritance - positive", function () {
                var alternative = [[Alpha, ExtendsAlpha, ExtendsAlphaAlpha]];
                var laFunc = (0, lookahead_1.buildSingleAlternativeLookaheadFunction)(alternative, tokens_1.tokenStructuredMatcher, false);
                (0, chai_1.expect)(laFunc.call(new MockParser([Alpha, ExtendsAlpha, ExtendsAlphaAlpha]))).to.be.true;
                (0, chai_1.expect)(laFunc.call(new MockParser([ExtendsAlpha, ExtendsAlpha, ExtendsAlphaAlpha]))).to.be.true;
                (0, chai_1.expect)(laFunc.call(new MockParser([ExtendsAlphaAlpha, ExtendsAlpha, ExtendsAlphaAlpha]))).to.be.true;
                (0, chai_1.expect)(laFunc.call(new MockParser([
                    ExtendsAlphaAlpha,
                    ExtendsAlphaAlpha,
                    ExtendsAlphaAlpha
                ]))).to.be.true;
            });
            it("complex optional with inheritance - negative", function () {
                var alternative = [[Alpha, ExtendsAlpha, ExtendsAlphaAlpha]];
                var laFunc = (0, lookahead_1.buildSingleAlternativeLookaheadFunction)(alternative, tokens_1.tokenStructuredMatcher, false);
                (0, chai_1.expect)(laFunc.call(new MockParser([Gamma, ExtendsAlpha, ExtendsAlphaAlpha]))).to.be.false;
                (0, chai_1.expect)(laFunc.call(new MockParser([ExtendsAlpha, Alpha, ExtendsAlphaAlpha]))).to.be.false;
                (0, chai_1.expect)(laFunc.call(new MockParser([ExtendsAlphaAlpha, ExtendsAlpha, ExtendsAlpha]))).to.be.false;
            });
        });
    });
});
//# sourceMappingURL=lookahead_spec.js.map