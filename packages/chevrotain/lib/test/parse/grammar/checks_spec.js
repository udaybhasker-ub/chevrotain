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
exports.StarTok = exports.MinusTok = exports.PlusTok = void 0;
var parser_traits_1 = require("../../../src/parse/parser/traits/parser_traits");
var parser_1 = require("../../../src/parse/parser/parser");
var checks_1 = require("../../../src/parse/grammar/checks");
var tokens_public_1 = require("../../../src/scan/tokens_public");
var first_1 = __importDefault(require("lodash/first"));
var map_1 = __importDefault(require("lodash/map"));
var gast_public_1 = require("../../../src/parse/grammar/gast/gast_public");
var errors_public_1 = require("../../../src/parse/errors_public");
var chai_1 = require("chai");
var builders_1 = require("../../utils/builders");
var omit_1 = __importDefault(require("lodash/omit"));
var getIdentTok = (0, builders_1.createDeferredTokenBuilder)({
    name: "IdentTok",
    pattern: /NA/
});
var getDotTok = (0, builders_1.createDeferredTokenBuilder)({
    name: "DotTok",
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
describe("the grammar validations", function () {
    it("validates every one of the TOP_RULEs in the input", function () {
        var expectedErrorsNoMsg = [
            {
                type: parser_1.ParserDefinitionErrorType.DUPLICATE_PRODUCTIONS,
                ruleName: "qualifiedNameErr1",
                dslName: "CONSUME",
                occurrence: 1,
                parameter: "IdentTok"
            },
            {
                type: parser_1.ParserDefinitionErrorType.DUPLICATE_PRODUCTIONS,
                ruleName: "qualifiedNameErr2",
                dslName: "MANY",
                occurrence: 1
            },
            {
                type: parser_1.ParserDefinitionErrorType.DUPLICATE_PRODUCTIONS,
                ruleName: "qualifiedNameErr2",
                dslName: "CONSUME",
                occurrence: 1,
                parameter: "DotTok"
            },
            {
                type: parser_1.ParserDefinitionErrorType.DUPLICATE_PRODUCTIONS,
                ruleName: "qualifiedNameErr2",
                dslName: "CONSUME",
                occurrence: 2,
                parameter: "IdentTok"
            }
        ];
        var qualifiedNameErr1 = new gast_public_1.Rule({
            name: "qualifiedNameErr1",
            definition: [
                new gast_public_1.Terminal({ terminalType: getIdentTok(), idx: 1 }),
                new gast_public_1.Repetition({
                    definition: [
                        new gast_public_1.Terminal({ terminalType: getDotTok() }),
                        new gast_public_1.Terminal({
                            terminalType: getIdentTok(),
                            idx: 1
                        }) // duplicate Terminal IdentTok with occurrence index 1
                    ]
                })
            ]
        });
        var qualifiedNameErr2 = new gast_public_1.Rule({
            name: "qualifiedNameErr2",
            definition: [
                new gast_public_1.Terminal({ terminalType: getIdentTok(), idx: 1 }),
                new gast_public_1.Repetition({
                    definition: [
                        new gast_public_1.Terminal({ terminalType: getDotTok() }),
                        new gast_public_1.Terminal({
                            terminalType: getIdentTok(),
                            idx: 2
                        })
                    ]
                }),
                new gast_public_1.Repetition({
                    definition: [
                        new gast_public_1.Terminal({ terminalType: getDotTok() }),
                        new gast_public_1.Terminal({
                            terminalType: getIdentTok(),
                            idx: 2
                        })
                    ]
                })
            ]
        });
        var actualErrors = (0, checks_1.validateGrammar)([qualifiedNameErr1, qualifiedNameErr2], 5, [], errors_public_1.defaultGrammarValidatorErrorProvider, "bamba");
        (0, chai_1.expect)(actualErrors.map(function (e) { return (0, omit_1.default)(e, "message"); })).to.deep.equal(expectedErrorsNoMsg);
    });
    it("does not allow duplicate grammar rule names", function () {
        var noErrors = (0, checks_1.validateRuleDoesNotAlreadyExist)(new gast_public_1.Rule({ name: "A", definition: [] }), [
            new gast_public_1.Rule({ name: "B", definition: [] }),
            new gast_public_1.Rule({ name: "C", definition: [] })
        ], "className", errors_public_1.defaultGrammarValidatorErrorProvider);
        //noinspection BadExpressionStatementJS
        (0, chai_1.expect)(noErrors).to.be.empty;
        var duplicateErr = (0, checks_1.validateRuleDoesNotAlreadyExist)(new gast_public_1.Rule({ name: "A", definition: [] }), [
            new gast_public_1.Rule({ name: "A", definition: [] }),
            new gast_public_1.Rule({ name: "A", definition: [] }),
            new gast_public_1.Rule({ name: "B", definition: [] }),
            new gast_public_1.Rule({ name: "C", definition: [] })
        ], "className", errors_public_1.defaultGrammarValidatorErrorProvider);
        //noinspection BadExpressionStatementJS
        (0, chai_1.expect)(duplicateErr).to.have.length(1);
        (0, chai_1.expect)(duplicateErr[0]).to.have.property("message");
        (0, chai_1.expect)(duplicateErr[0]).to.have.property("type", parser_1.ParserDefinitionErrorType.DUPLICATE_RULE_NAME);
        (0, chai_1.expect)(duplicateErr[0]).to.have.property("ruleName", "A");
    });
    it("does not allow overriding a rule which does not already exist", function () {
        var positive = (0, checks_1.validateRuleIsOverridden)("AAA", ["BBB", "CCC"], "className");
        (0, chai_1.expect)(positive).to.have.lengthOf(1);
        (0, chai_1.expect)(positive[0].message).to.contain("Invalid rule override");
        (0, chai_1.expect)(positive[0].type).to.equal(parser_1.ParserDefinitionErrorType.INVALID_RULE_OVERRIDE);
        (0, chai_1.expect)(positive[0].ruleName).to.equal("AAA");
        var negative = (0, checks_1.validateRuleIsOverridden)("AAA", ["BBB", "CCC", "AAA"], "className");
        (0, chai_1.expect)(negative).to.have.lengthOf(0);
    });
});
describe("identifyProductionForDuplicates function", function () {
    it("generates DSL code for a ProdRef", function () {
        var dslCode = (0, checks_1.identifyProductionForDuplicates)(new gast_public_1.NonTerminal({ nonTerminalName: "ActionDeclaration" }));
        (0, chai_1.expect)(dslCode).to.equal("SUBRULE_#_1_#_ActionDeclaration");
    });
    it("generates DSL code for a OPTION", function () {
        var dslCode = (0, checks_1.identifyProductionForDuplicates)(new gast_public_1.Option({ definition: [], idx: 3 }));
        (0, chai_1.expect)(dslCode).to.equal("OPTION_#_3_#_");
    });
    it("generates DSL code for a AT_LEAST_ONE", function () {
        var dslCode = (0, checks_1.identifyProductionForDuplicates)(new gast_public_1.RepetitionMandatory({ definition: [] }));
        (0, chai_1.expect)(dslCode).to.equal("AT_LEAST_ONE_#_1_#_");
    });
    it("generates DSL code for a MANY", function () {
        var dslCode = (0, checks_1.identifyProductionForDuplicates)(new gast_public_1.Repetition({ definition: [], idx: 5 }));
        (0, chai_1.expect)(dslCode).to.equal("MANY_#_5_#_");
    });
    it("generates DSL code for a OR", function () {
        var dslCode = (0, checks_1.identifyProductionForDuplicates)(new gast_public_1.Alternation({ definition: [], idx: 1 }));
        (0, chai_1.expect)(dslCode).to.equal("OR_#_1_#_");
    });
    it("generates DSL code for a Terminal", function () {
        var dslCode = (0, checks_1.identifyProductionForDuplicates)(new gast_public_1.Terminal({ terminalType: getIdentTok(), idx: 4 }));
        (0, chai_1.expect)(dslCode).to.equal("CONSUME_#_4_#_IdentTok");
    });
});
describe("OccurrenceValidationCollector GASTVisitor class", function () {
    var actionDec;
    before(function () {
        var LParenTok = (0, tokens_public_1.createToken)({ name: "LParenTok", pattern: /NA/ });
        var RParenTok = (0, tokens_public_1.createToken)({ name: "RParenTok", pattern: /NA/ });
        var LSquareTok = (0, tokens_public_1.createToken)({ name: "LSquareTok", pattern: /NA/ });
        var RSquareTok = (0, tokens_public_1.createToken)({ name: "RSquareTok", pattern: /NA/ });
        var ColonTok = (0, tokens_public_1.createToken)({ name: "ColonTok", pattern: /NA/ });
        var paramSpec = new gast_public_1.Rule({
            name: "paramSpec",
            definition: [
                new gast_public_1.Terminal({ terminalType: getIdentTok() }),
                new gast_public_1.Terminal({ terminalType: ColonTok }),
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
        var SemicolonTok = (0, tokens_public_1.createToken)({ name: "SemicolonTok", pattern: /NA/ });
        var CommaTok = (0, tokens_public_1.createToken)({ name: "CommaTok", pattern: /NA/ });
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
                        new gast_public_1.Terminal({ terminalType: ColonTok }),
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
    it("collects all the productions relevant to occurrence validation", function () {
        var qualifiedNameVisitor = new checks_1.OccurrenceValidationCollector();
        buildQualifiedName().accept(qualifiedNameVisitor);
        (0, chai_1.expect)(qualifiedNameVisitor.allProductions.length).to.equal(4);
        // TODO: check set equality
        var actionDecVisitor = new checks_1.OccurrenceValidationCollector();
        actionDec.accept(actionDecVisitor);
        (0, chai_1.expect)(actionDecVisitor.allProductions.length).to.equal(13);
        // TODO: check set equality
    });
});
describe("the getFirstNoneTerminal function", function () {
    var dummyRule;
    var dummyRule2;
    var dummyRule3;
    before(function () {
        var DummyToken = /** @class */ (function () {
            function DummyToken() {
            }
            DummyToken.PATTERN = /NA/;
            return DummyToken;
        }());
        dummyRule = new gast_public_1.Rule({
            name: "dummyRule",
            definition: [new gast_public_1.Terminal({ terminalType: DummyToken })]
        });
        dummyRule2 = new gast_public_1.Rule({
            name: "dummyRule2",
            definition: [new gast_public_1.Terminal({ terminalType: DummyToken })]
        });
        dummyRule3 = new gast_public_1.Rule({
            name: "dummyRule3",
            definition: [new gast_public_1.Terminal({ terminalType: DummyToken })]
        });
    });
    it("can find the firstNoneTerminal of an empty sequence", function () {
        (0, chai_1.expect)((0, checks_1.getFirstNoneTerminal)([])).to.be.empty;
    });
    it("can find the firstNoneTerminal of a sequence with only one item", function () {
        var result = (0, checks_1.getFirstNoneTerminal)([
            new gast_public_1.NonTerminal({
                nonTerminalName: "dummyRule",
                referencedRule: dummyRule
            })
        ]);
        (0, chai_1.expect)(result).to.have.length(1);
        (0, chai_1.expect)((0, first_1.default)(result).name).to.equal("dummyRule");
    });
    it("can find the firstNoneTerminal of a sequence with two items", function () {
        var sqeuence = [
            new gast_public_1.NonTerminal({
                nonTerminalName: "dummyRule",
                referencedRule: dummyRule
            }),
            new gast_public_1.NonTerminal({
                nonTerminalName: "dummyRule2",
                referencedRule: dummyRule2
            })
        ];
        var result = (0, checks_1.getFirstNoneTerminal)(sqeuence);
        (0, chai_1.expect)(result).to.have.length(1);
        (0, chai_1.expect)((0, first_1.default)(result).name).to.equal("dummyRule");
    });
    it("can find the firstNoneTerminal of a sequence with two items where the first is optional", function () {
        var sqeuence = [
            new gast_public_1.Option({
                definition: [
                    new gast_public_1.NonTerminal({
                        nonTerminalName: "dummyRule",
                        referencedRule: dummyRule
                    })
                ]
            }),
            new gast_public_1.NonTerminal({
                nonTerminalName: "dummyRule2",
                referencedRule: dummyRule2
            })
        ];
        var result = (0, checks_1.getFirstNoneTerminal)(sqeuence);
        (0, chai_1.expect)(result).to.have.length(2);
        var resultRuleNames = (0, map_1.default)(result, function (currItem) { return currItem.name; });
        (0, chai_1.expect)(resultRuleNames).to.include.members(["dummyRule", "dummyRule2"]);
    });
    it("can find the firstNoneTerminal of an alternation", function () {
        var alternation = [
            new gast_public_1.Alternation({
                definition: [
                    new gast_public_1.Alternative({
                        definition: [
                            new gast_public_1.NonTerminal({
                                nonTerminalName: "dummyRule",
                                referencedRule: dummyRule
                            })
                        ]
                    }),
                    new gast_public_1.Alternative({
                        definition: [
                            new gast_public_1.NonTerminal({
                                nonTerminalName: "dummyRule2",
                                referencedRule: dummyRule2
                            })
                        ]
                    }),
                    new gast_public_1.Alternative({
                        definition: [
                            new gast_public_1.NonTerminal({
                                nonTerminalName: "dummyRule3",
                                referencedRule: dummyRule3
                            })
                        ]
                    })
                ]
            })
        ];
        var result = (0, checks_1.getFirstNoneTerminal)(alternation);
        (0, chai_1.expect)(result).to.have.length(3);
        var resultRuleNames = (0, map_1.default)(result, function (currItem) { return currItem.name; });
        (0, chai_1.expect)(resultRuleNames).to.include.members([
            "dummyRule",
            "dummyRule2",
            "dummyRule3"
        ]);
    });
    it("can find the firstNoneTerminal of an optional repetition", function () {
        var alternation = [
            new gast_public_1.Repetition({
                definition: [
                    new gast_public_1.Alternative({
                        definition: [
                            new gast_public_1.NonTerminal({
                                nonTerminalName: "dummyRule",
                                referencedRule: dummyRule
                            })
                        ]
                    }),
                    new gast_public_1.Alternative({
                        definition: [
                            new gast_public_1.NonTerminal({
                                nonTerminalName: "dummyRule2",
                                referencedRule: dummyRule2
                            })
                        ]
                    })
                ]
            }),
            new gast_public_1.NonTerminal({
                nonTerminalName: "dummyRule3",
                referencedRule: dummyRule3
            })
        ];
        var result = (0, checks_1.getFirstNoneTerminal)(alternation);
        (0, chai_1.expect)(result).to.have.length(2);
        var resultRuleNames = (0, map_1.default)(result, function (currItem) { return currItem.name; });
        (0, chai_1.expect)(resultRuleNames).to.include.members(["dummyRule", "dummyRule3"]);
    });
    it("can find the firstNoneTerminal of a mandatory repetition", function () {
        var alternation = [
            new gast_public_1.RepetitionMandatory({
                definition: [
                    new gast_public_1.Alternative({
                        definition: [
                            new gast_public_1.NonTerminal({
                                nonTerminalName: "dummyRule",
                                referencedRule: dummyRule
                            })
                        ]
                    }),
                    new gast_public_1.Alternative({
                        definition: [
                            new gast_public_1.NonTerminal({
                                nonTerminalName: "dummyRule2",
                                referencedRule: dummyRule2
                            })
                        ]
                    })
                ]
            }),
            new gast_public_1.NonTerminal({
                nonTerminalName: "dummyRule3",
                referencedRule: dummyRule3
            })
        ];
        var result = (0, checks_1.getFirstNoneTerminal)(alternation);
        (0, chai_1.expect)(result).to.have.length(1);
        var resultRuleNames = (0, map_1.default)(result, function (currItem) { return currItem.name; });
        (0, chai_1.expect)(resultRuleNames).to.include.members(["dummyRule"]);
    });
    // This test was moved here from a different `describe` because of a a dependency to `dummyRule` variable
    it("will throw an error when there are too many alternatives in an alternation", function () {
        var alternatives = [];
        for (var i = 0; i < 256; i++) {
            alternatives.push(new gast_public_1.Alternative({
                definition: [
                    new gast_public_1.NonTerminal({
                        nonTerminalName: "dummyRule",
                        referencedRule: dummyRule
                    })
                ]
            }));
        }
        var ruleWithTooManyAlts = new gast_public_1.Rule({
            name: "blah",
            definition: [new gast_public_1.Alternation({ definition: alternatives })]
        });
        var actual = (0, checks_1.validateTooManyAlts)(ruleWithTooManyAlts, errors_public_1.defaultGrammarValidatorErrorProvider);
        (0, chai_1.expect)(actual).to.have.lengthOf(1);
        (0, chai_1.expect)(actual[0].type).to.equal(parser_1.ParserDefinitionErrorType.TOO_MANY_ALTS);
        (0, chai_1.expect)(actual[0].ruleName).to.equal("blah");
        (0, chai_1.expect)(actual[0].message).to.contain("An Alternation cannot have more than 256 alternatives");
    });
});
var PlusTok = /** @class */ (function () {
    function PlusTok() {
    }
    PlusTok.PATTERN = /NA/;
    return PlusTok;
}());
exports.PlusTok = PlusTok;
var MinusTok = /** @class */ (function () {
    function MinusTok() {
    }
    MinusTok.PATTERN = /NA/;
    return MinusTok;
}());
exports.MinusTok = MinusTok;
var StarTok = /** @class */ (function () {
    function StarTok() {
    }
    StarTok.PATTERN = /NA/;
    return StarTok;
}());
exports.StarTok = StarTok;
describe("The duplicate occurrence validations full flow", function () {
    var myToken;
    var myOtherToken;
    before(function () {
        myToken = (0, tokens_public_1.createToken)({ name: "myToken" });
        myOtherToken = (0, tokens_public_1.createToken)({ name: "myOtherToken" });
    });
    it("will throw errors on duplicate Terminals consumption in the same top level rule", function () {
        var ErroneousOccurrenceNumUsageParser1 = /** @class */ (function (_super) {
            __extends(ErroneousOccurrenceNumUsageParser1, _super);
            function ErroneousOccurrenceNumUsageParser1(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [PlusTok]) || this;
                _this.duplicateRef = _this.RULE("duplicateRef", function () {
                    _this.SUBRULE1(_this.anotherRule);
                    _this.SUBRULE1(_this.anotherRule);
                });
                _this.anotherRule = _this.RULE("anotherRule", function () {
                    _this.CONSUME(PlusTok);
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return ErroneousOccurrenceNumUsageParser1;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new ErroneousOccurrenceNumUsageParser1(); }).to.throw("->SUBRULE1<- with argument: ->anotherRule<-");
        (0, chai_1.expect)(function () { return new ErroneousOccurrenceNumUsageParser1(); }).to.throw("appears more than once (2 times) in the top level rule: ->duplicateRef<-");
    });
    it("will throw errors on duplicate Subrules references in the same top level rule", function () {
        var ErroneousOccurrenceNumUsageParser2 = /** @class */ (function (_super) {
            __extends(ErroneousOccurrenceNumUsageParser2, _super);
            function ErroneousOccurrenceNumUsageParser2(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [PlusTok]) || this;
                _this.duplicateTerminal = _this.RULE("duplicateTerminal", function () {
                    _this.CONSUME3(PlusTok);
                    _this.CONSUME3(PlusTok);
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return ErroneousOccurrenceNumUsageParser2;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new ErroneousOccurrenceNumUsageParser2(); }).to.throw("CONSUME");
        (0, chai_1.expect)(function () { return new ErroneousOccurrenceNumUsageParser2(); }).to.throw("3");
        (0, chai_1.expect)(function () { return new ErroneousOccurrenceNumUsageParser2(); }).to.throw("PlusTok");
        (0, chai_1.expect)(function () { return new ErroneousOccurrenceNumUsageParser2(); }).to.throw("duplicateTerminal");
    });
    it("will throw errors on duplicate MANY productions in the same top level rule", function () {
        var ErroneousOccurrenceNumUsageParser3 = /** @class */ (function (_super) {
            __extends(ErroneousOccurrenceNumUsageParser3, _super);
            function ErroneousOccurrenceNumUsageParser3(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [PlusTok, MinusTok]) || this;
                _this.duplicateMany = _this.RULE("duplicateMany", function () {
                    _this.MANY(function () {
                        _this.CONSUME1(MinusTok);
                        _this.MANY(function () {
                            _this.CONSUME1(PlusTok);
                        });
                    });
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return ErroneousOccurrenceNumUsageParser3;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new ErroneousOccurrenceNumUsageParser3(); }).to.throw("->MANY<-");
        (0, chai_1.expect)(function () { return new ErroneousOccurrenceNumUsageParser3(); }).to.throw("appears more than once (2 times) in the top level rule: ->duplicateMany<-");
        (0, chai_1.expect)(function () { return new ErroneousOccurrenceNumUsageParser3(); }).to.throw("https://chevrotain.io/docs/FAQ.html#NUMERICAL_SUFFIXES");
    });
    it("won't detect issues in a Parser using Tokens created by extendToken(...) utility (anonymous)", function () {
        var ValidOccurrenceNumUsageParser = /** @class */ (function (_super) {
            __extends(ValidOccurrenceNumUsageParser, _super);
            function ValidOccurrenceNumUsageParser(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [myToken, myOtherToken]) || this;
                _this.anonymousTokens = _this.RULE("anonymousTokens", function () {
                    _this.CONSUME1(myToken);
                    _this.CONSUME1(myOtherToken);
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return ValidOccurrenceNumUsageParser;
        }(parser_traits_1.EmbeddedActionsParser));
        var parser = new ValidOccurrenceNumUsageParser();
    });
});
describe("The Recorder runtime checks full flow", function () {
    var myToken = (0, tokens_public_1.createToken)({ name: "myToken" });
    var myOtherToken = (0, tokens_public_1.createToken)({ name: "myOtherToken" });
    it("will return EOF for LA calls during recording phase", function () {
        var LookAheadParser = /** @class */ (function (_super) {
            __extends(LookAheadParser, _super);
            function LookAheadParser(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [myToken, myOtherToken]) || this;
                _this.one = _this.RULE("one", function () {
                    (0, chai_1.expect)(_this.LA(0)).to.equal(parser_1.END_OF_FILE);
                    _this.CONSUME(myToken);
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return LookAheadParser;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new LookAheadParser(); }).to.not.throw();
    });
    it("won't invoke semantic actions during recording phase", function () {
        var SemanticActionsParsers = /** @class */ (function (_super) {
            __extends(SemanticActionsParsers, _super);
            function SemanticActionsParsers(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [myToken, myOtherToken]) || this;
                _this.one = _this.RULE("one", function () {
                    _this.ACTION(function () {
                        if (_this.RECORDING_PHASE) {
                            throw Error("Should not be executed during recording");
                        }
                    });
                    _this.CONSUME(myToken);
                });
                _this.performSelfAnalysis();
                _this.input = input;
                _this.counter = 0;
                return _this;
            }
            return SemanticActionsParsers;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new SemanticActionsParsers(); }).to.not.throw();
    });
    it("won't execute backtracking during recording phase", function () {
        var BacktrackingRecordingParser = /** @class */ (function (_super) {
            __extends(BacktrackingRecordingParser, _super);
            function BacktrackingRecordingParser(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [myToken, myOtherToken]) || this;
                _this.one = _this.RULE("one", function () {
                    var backtrackResult = _this.BACKTRACK(_this.two)();
                    if (_this.RECORDING_PHASE) {
                        // during recording backtracking always returns true backtracking
                        (0, chai_1.expect)(backtrackResult).to.be.true;
                    }
                    _this.CONSUME(myOtherToken);
                });
                _this.two = _this.RULE("two", function () {
                    // if this is executed via backtracking the counter will increase
                    // once for recording and once for backtracking
                    _this.counter++;
                    _this.CONSUME(myToken);
                });
                _this.counter = 0;
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return BacktrackingRecordingParser;
        }(parser_traits_1.EmbeddedActionsParser));
        var parser = new BacktrackingRecordingParser();
        (0, chai_1.expect)(parser.counter).to.equal(1);
    });
    it("will throw an error when trying to init a parser with unresolved rule references", function () {
        var InvalidRefParser = /** @class */ (function (_super) {
            __extends(InvalidRefParser, _super);
            function InvalidRefParser(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [myToken, myOtherToken]) || this;
                _this.one = _this.RULE("one", function () {
                    _this.SUBRULE(_this.oopsTypo);
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return InvalidRefParser;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new InvalidRefParser(); }).to.throw("<SUBRULE>");
        (0, chai_1.expect)(function () { return new InvalidRefParser(); }).to.throw("argument is invalid");
        (0, chai_1.expect)(function () { return new InvalidRefParser(); }).to.throw("but got: <undefined>");
        (0, chai_1.expect)(function () { return new InvalidRefParser(); }).to.throw("inside top level rule: <one>");
    });
    it("will throw an error when trying to init a parser with unresolved tokenType references", function () {
        var InvalidTokTypeParser = /** @class */ (function (_super) {
            __extends(InvalidTokTypeParser, _super);
            function InvalidTokTypeParser(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [myToken, myOtherToken]) || this;
                _this.one = _this.RULE("two", function () {
                    _this.CONSUME3(null);
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return InvalidTokTypeParser;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new InvalidTokTypeParser(); }).to.throw("<CONSUME3>");
        (0, chai_1.expect)(function () { return new InvalidTokTypeParser(); }).to.throw("argument is invalid");
        (0, chai_1.expect)(function () { return new InvalidTokTypeParser(); }).to.throw("but got: <null>");
        (0, chai_1.expect)(function () { return new InvalidTokTypeParser(); }).to.throw("inside top level rule: <two>");
    });
    context("will throw an error when trying to init a parser with an invalid method idx", function () {
        it("consume", function () {
            var InvalidIdxParser = /** @class */ (function (_super) {
                __extends(InvalidIdxParser, _super);
                function InvalidIdxParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, [myToken, myOtherToken]) || this;
                    _this.one = _this.RULE("one", function () {
                        _this.consume(256, myToken);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return InvalidIdxParser;
            }(parser_traits_1.EmbeddedActionsParser));
            (0, chai_1.expect)(function () { return new InvalidIdxParser(); }).to.throw("Invalid DSL Method idx value: <256>");
            (0, chai_1.expect)(function () { return new InvalidIdxParser(); }).to.throw("Idx value must be a none negative value smaller than 256");
        });
        it("subrule", function () {
            var ATok = (0, tokens_public_1.createToken)({ name: "A" });
            var InvalidIdxParser = /** @class */ (function (_super) {
                __extends(InvalidIdxParser, _super);
                function InvalidIdxParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, [myToken, myOtherToken]) || this;
                    _this.one = _this.RULE("one", function () {
                        _this.subrule(-1, _this.two);
                    });
                    _this.two = _this.RULE("two", function () {
                        _this.consume(1, ATok);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return InvalidIdxParser;
            }(parser_traits_1.CstParser));
            (0, chai_1.expect)(function () { return new InvalidIdxParser(); }).to.throw("Invalid DSL Method idx value: <-1>");
            (0, chai_1.expect)(function () { return new InvalidIdxParser(); }).to.throw("Idx value must be a none negative value smaller than 256");
        });
        it("option", function () {
            var InvalidIdxParser = /** @class */ (function (_super) {
                __extends(InvalidIdxParser, _super);
                function InvalidIdxParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, [myToken, myOtherToken]) || this;
                    _this.one = _this.RULE("one", function () {
                        _this.option(666, function () {
                            _this.consume(1, myToken);
                        });
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return InvalidIdxParser;
            }(parser_traits_1.EmbeddedActionsParser));
            (0, chai_1.expect)(function () { return new InvalidIdxParser(); }).to.throw("Invalid DSL Method idx value: <666>");
            (0, chai_1.expect)(function () { return new InvalidIdxParser(); }).to.throw("Idx value must be a none negative value smaller than 256");
        });
        it("many", function () {
            var InvalidIdxParser = /** @class */ (function (_super) {
                __extends(InvalidIdxParser, _super);
                function InvalidIdxParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, [myToken, myOtherToken]) || this;
                    _this.one = _this.RULE("one", function () {
                        _this.many(-333, function () {
                            _this.consume(1, myToken);
                        });
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return InvalidIdxParser;
            }(parser_traits_1.EmbeddedActionsParser));
            (0, chai_1.expect)(function () { return new InvalidIdxParser(); }).to.throw("Invalid DSL Method idx value: <-333>");
            (0, chai_1.expect)(function () { return new InvalidIdxParser(); }).to.throw("Idx value must be a none negative value smaller than 256");
        });
        it("atLeastOne", function () {
            var InvalidIdxParser = /** @class */ (function (_super) {
                __extends(InvalidIdxParser, _super);
                function InvalidIdxParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, [myToken, myOtherToken]) || this;
                    _this.one = _this.RULE("one", function () {
                        _this.atLeastOne(1999, function () {
                            _this.consume(1, myToken);
                        });
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return InvalidIdxParser;
            }(parser_traits_1.EmbeddedActionsParser));
            (0, chai_1.expect)(function () { return new InvalidIdxParser(); }).to.throw("Invalid DSL Method idx value: <1999>");
            (0, chai_1.expect)(function () { return new InvalidIdxParser(); }).to.throw("Idx value must be a none negative value smaller than 256");
        });
        it("or", function () {
            var InvalidIdxParser = /** @class */ (function (_super) {
                __extends(InvalidIdxParser, _super);
                function InvalidIdxParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, [myToken, myOtherToken]) || this;
                    _this.one = _this.RULE("one", function () {
                        _this.or(543, [
                            {
                                ALT: function () {
                                    _this.consume(1, myToken);
                                }
                            }
                        ]);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return InvalidIdxParser;
            }(parser_traits_1.EmbeddedActionsParser));
            (0, chai_1.expect)(function () { return new InvalidIdxParser(); }).to.throw("Invalid DSL Method idx value: <543>");
            (0, chai_1.expect)(function () { return new InvalidIdxParser(); }).to.throw("Idx value must be a none negative value smaller than 256");
        });
    });
    context("augmenting error messages", function () {
        it("will add additional details to other runtime exceptions encountered during recording phase", function () {
            var OtherRecordingErrorParser = /** @class */ (function (_super) {
                __extends(OtherRecordingErrorParser, _super);
                function OtherRecordingErrorParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, [myToken, myOtherToken]) || this;
                    _this.one = _this.RULE("two", function () {
                        throw new Error("OOPS");
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return OtherRecordingErrorParser;
            }(parser_traits_1.EmbeddedActionsParser));
            (0, chai_1.expect)(function () { return new OtherRecordingErrorParser(); }).to.throw('This error was thrown during the "grammar recording phase"');
        });
        it("will not fail when the original error is immutable", function () {
            var OtherRecordingErrorParser = /** @class */ (function (_super) {
                __extends(OtherRecordingErrorParser, _super);
                function OtherRecordingErrorParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, [myToken, myOtherToken]) || this;
                    _this.one = _this.RULE("two", function () {
                        // We cannot mutate a string object
                        throw "Oops";
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return OtherRecordingErrorParser;
            }(parser_traits_1.EmbeddedActionsParser));
            (0, chai_1.expect)(function () { return new OtherRecordingErrorParser(); }).to.throw("Oops");
        });
    });
});
describe("The reference resolver validation full flow", function () {
    var myToken = (0, tokens_public_1.createToken)({ name: "myToken" });
    var myOtherToken = (0, tokens_public_1.createToken)({ name: "myOtherToken" });
    it("won't throw an error when trying to init a parser with definition errors but with a flag active to defer handling" +
        "of definition errors", function () {
        var DupConsumeParser = /** @class */ (function (_super) {
            __extends(DupConsumeParser, _super);
            function DupConsumeParser(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [myToken, myOtherToken]) || this;
                _this.one = _this.RULE("one", function () {
                    _this.CONSUME(myToken);
                    _this.CONSUME(myToken); // duplicate consume with the same suffix.
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return DupConsumeParser;
        }(parser_traits_1.EmbeddedActionsParser));
        Object.getPrototypeOf(parser_traits_1.EmbeddedActionsParser).DEFER_DEFINITION_ERRORS_HANDLING = true;
        (0, chai_1.expect)(function () { return new DupConsumeParser(); }).to.not.throw();
        (0, chai_1.expect)(function () { return new DupConsumeParser(); }).to.not.throw();
        (0, chai_1.expect)(function () { return new DupConsumeParser(); }).to.not.throw();
        Object.getPrototypeOf(parser_traits_1.EmbeddedActionsParser).DEFER_DEFINITION_ERRORS_HANDLING = false;
    });
});
describe("The rule names validation full flow", function () {
    var myToken;
    var myOtherToken;
    before(function () {
        myToken = (0, tokens_public_1.createToken)({ name: "myToken" });
        myOtherToken = (0, tokens_public_1.createToken)({ name: "myOtherToken" });
    });
    it("will throw an error when trying to init a parser with duplicate ruleNames", function () {
        var DuplicateRulesParser = /** @class */ (function (_super) {
            __extends(DuplicateRulesParser, _super);
            function DuplicateRulesParser(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [myToken, myOtherToken]) || this;
                _this.one = _this.RULE("oops_duplicate", function () { });
                _this.two = _this.RULE("oops_duplicate", function () { });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return DuplicateRulesParser;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new DuplicateRulesParser(); }).to.throw("is already defined in the grammar");
        (0, chai_1.expect)(function () { return new DuplicateRulesParser(); }).to.throw("DuplicateRulesParser");
        (0, chai_1.expect)(function () { return new DuplicateRulesParser(); }).to.throw("oops_duplicate");
    });
    it("won't throw an errors when trying to init a parser with definition errors but with a flag active to defer handling" +
        "of definition errors (ruleName validation", function () {
        var InvalidRuleNameParser = /** @class */ (function (_super) {
            __extends(InvalidRuleNameParser, _super);
            function InvalidRuleNameParser(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [myToken, myOtherToken]) || this;
                _this.one = _this.RULE("שלום", function () { });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return InvalidRuleNameParser;
        }(parser_traits_1.EmbeddedActionsParser));
        var DuplicateRulesParser = /** @class */ (function (_super) {
            __extends(DuplicateRulesParser, _super);
            function DuplicateRulesParser(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [myToken, myOtherToken]) || this;
                _this.one = _this.RULE("oops_duplicate", function () { });
                _this.two = _this.RULE("oops_duplicate", function () { });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return DuplicateRulesParser;
        }(parser_traits_1.EmbeddedActionsParser));
        Object.getPrototypeOf(parser_traits_1.EmbeddedActionsParser).DEFER_DEFINITION_ERRORS_HANDLING = true;
        (0, chai_1.expect)(function () { return new InvalidRuleNameParser(); }).to.not.throw();
        (0, chai_1.expect)(function () { return new InvalidRuleNameParser(); }).to.not.throw();
        (0, chai_1.expect)(function () { return new DuplicateRulesParser(); }).to.not.throw();
        (0, chai_1.expect)(function () { return new DuplicateRulesParser(); }).to.not.throw();
        Object.getPrototypeOf(parser_traits_1.EmbeddedActionsParser).DEFER_DEFINITION_ERRORS_HANDLING = false;
    });
});
var StarToken = /** @class */ (function () {
    function StarToken() {
    }
    StarToken.PATTERN = /NA/;
    return StarToken;
}());
var DirectlyLeftRecursive = /** @class */ (function (_super) {
    __extends(DirectlyLeftRecursive, _super);
    function DirectlyLeftRecursive(input) {
        if (input === void 0) { input = []; }
        var _this = _super.call(this, [StarToken]) || this;
        _this.A = _this.RULE("A", function () {
            _this.SUBRULE1(_this.A);
        });
        _this.performSelfAnalysis();
        _this.input = input;
        return _this;
    }
    return DirectlyLeftRecursive;
}(parser_traits_1.EmbeddedActionsParser));
var InDirectlyLeftRecursive = /** @class */ (function (_super) {
    __extends(InDirectlyLeftRecursive, _super);
    function InDirectlyLeftRecursive(input) {
        if (input === void 0) { input = []; }
        var _this = _super.call(this, [StarToken]) || this;
        _this.A = _this.RULE("A", function () {
            _this.SUBRULE1(_this.B);
        });
        _this.B = _this.RULE("B", function () {
            _this.SUBRULE1(_this.A);
        });
        _this.performSelfAnalysis();
        _this.input = input;
        return _this;
    }
    return InDirectlyLeftRecursive;
}(parser_traits_1.EmbeddedActionsParser));
var ComplexInDirectlyLeftRecursive = /** @class */ (function (_super) {
    __extends(ComplexInDirectlyLeftRecursive, _super);
    function ComplexInDirectlyLeftRecursive(input) {
        if (input === void 0) { input = []; }
        var _this = _super.call(this, [StarToken]) || this;
        _this.A = _this.RULE("A", function () {
            _this.SUBRULE1(_this.B);
        });
        _this.B = _this.RULE("B", function () {
            _this.MANY(function () {
                _this.SUBRULE1(_this.A);
            });
            _this.CONSUME(StarToken);
        });
        _this.performSelfAnalysis();
        _this.input = input;
        return _this;
    }
    return ComplexInDirectlyLeftRecursive;
}(parser_traits_1.EmbeddedActionsParser));
describe("The left recursion detection full flow", function () {
    it("will throw an error when trying to init a parser with direct left recursion", function () {
        (0, chai_1.expect)(function () { return new DirectlyLeftRecursive(); }).to.throw("Left Recursion found in grammar");
        (0, chai_1.expect)(function () { return new DirectlyLeftRecursive(); }).to.throw("A --> A");
    });
    it("will throw an error when trying to init a parser with indirect left recursion", function () {
        (0, chai_1.expect)(function () { return new InDirectlyLeftRecursive(); }).to.throw("Left Recursion found in grammar");
        (0, chai_1.expect)(function () { return new InDirectlyLeftRecursive(); }).to.throw("A --> B --> A");
    });
    it("will throw an error when trying to init a parser with indirect left recursion - complex", function () {
        (0, chai_1.expect)(function () { return new ComplexInDirectlyLeftRecursive(); }).to.throw("Left Recursion found in grammar");
        (0, chai_1.expect)(function () { return new ComplexInDirectlyLeftRecursive(); }).to.throw("A --> B --> A");
    });
});
describe("The empty alternative detection full flow", function () {
    it("will throw an error when an empty alternative is not the last alternative", function () {
        var EmptyAltAmbiguityParser = /** @class */ (function (_super) {
            __extends(EmptyAltAmbiguityParser, _super);
            function EmptyAltAmbiguityParser(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [PlusTok, StarTok]) || this;
                _this.noneLastEmpty = _this.RULE("noneLastEmpty", function () {
                    _this.OR1([
                        {
                            ALT: function () {
                                _this.CONSUME1(PlusTok);
                            }
                        },
                        {
                            ALT: (0, parser_1.EMPTY_ALT)()
                        },
                        // empty alternative #3 which is not the last one!
                        { ALT: function () { } },
                        {
                            ALT: function () {
                                _this.CONSUME2(StarTok);
                            }
                        }
                    ]);
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return EmptyAltAmbiguityParser;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new EmptyAltAmbiguityParser(); }).to.throw("Ambiguous empty alternative");
        (0, chai_1.expect)(function () { return new EmptyAltAmbiguityParser(); }).to.throw("3");
        (0, chai_1.expect)(function () { return new EmptyAltAmbiguityParser(); }).to.throw("2");
    });
    it("will throw an error when an empty alternative is not the last alternative - Indirect", function () {
        var EmptyAltIndirectAmbiguityParser = /** @class */ (function (_super) {
            __extends(EmptyAltIndirectAmbiguityParser, _super);
            function EmptyAltIndirectAmbiguityParser(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [PlusTok, StarTok]) || this;
                _this.noneLastEmpty = _this.RULE("noneLastEmpty", function () {
                    _this.OR1([
                        {
                            ALT: function () {
                                _this.CONSUME1(PlusTok);
                            }
                        },
                        {
                            ALT: function () {
                                _this.SUBRULE(_this.emptyRule);
                            }
                        },
                        // empty alternative #3 which is not the last one!
                        { ALT: function () { } },
                        {
                            ALT: function () {
                                _this.CONSUME2(StarTok);
                            }
                        }
                    ]);
                });
                _this.emptyRule = _this.RULE("emptyRule", function () { });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return EmptyAltIndirectAmbiguityParser;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new EmptyAltIndirectAmbiguityParser(); }).to.throw("Ambiguous empty alternative");
        (0, chai_1.expect)(function () { return new EmptyAltIndirectAmbiguityParser(); }).to.throw("3");
        (0, chai_1.expect)(function () { return new EmptyAltIndirectAmbiguityParser(); }).to.throw("2");
    });
    it("will detect alternative ambiguity with identical lookaheads", function () {
        var AltAmbiguityParserImplicitOccurence = /** @class */ (function (_super) {
            __extends(AltAmbiguityParserImplicitOccurence, _super);
            function AltAmbiguityParserImplicitOccurence(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [PlusTok, StarTok]) || this;
                _this.noneLastEmpty = _this.RULE("noneLastEmpty", function () {
                    _this.OR([
                        {
                            ALT: function () {
                                _this.CONSUME1(PlusTok);
                                _this.CONSUME1(StarTok);
                            }
                        },
                        {
                            ALT: function () {
                                _this.CONSUME2(PlusTok);
                                _this.CONSUME2(StarTok);
                            }
                        }
                    ]);
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return AltAmbiguityParserImplicitOccurence;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new AltAmbiguityParserImplicitOccurence(); }).to.throw("Ambiguous Alternatives Detected");
        (0, chai_1.expect)(function () { return new AltAmbiguityParserImplicitOccurence(); }).to.throw("1");
        (0, chai_1.expect)(function () { return new AltAmbiguityParserImplicitOccurence(); }).to.throw("2");
        (0, chai_1.expect)(function () { return new AltAmbiguityParserImplicitOccurence(); }).to.throw("<PlusTok, StarTok> may appears as a prefix path");
    });
    it("will detect alternative ambiguity with identical lookahead - custom maxLookAhead", function () {
        var AltAmbiguityParserImplicitOccurrence = /** @class */ (function (_super) {
            __extends(AltAmbiguityParserImplicitOccurrence, _super);
            function AltAmbiguityParserImplicitOccurrence(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [PlusTok, StarTok]) || this;
                _this.noneLastEmpty = _this.RULE("AmbiguityDueToExplicitLowLookahead", function () {
                    _this.OR({
                        MAX_LOOKAHEAD: 1,
                        DEF: [
                            {
                                ALT: function () {
                                    _this.CONSUME1(PlusTok);
                                    _this.CONSUME1(PlusTok);
                                }
                            },
                            {
                                ALT: function () {
                                    _this.CONSUME2(PlusTok);
                                    _this.CONSUME2(StarTok);
                                }
                            }
                        ]
                    });
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return AltAmbiguityParserImplicitOccurrence;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new AltAmbiguityParserImplicitOccurrence(); }).to.throw("Ambiguous Alternatives Detected");
        (0, chai_1.expect)(function () { return new AltAmbiguityParserImplicitOccurrence(); }).to.throw("1");
        (0, chai_1.expect)(function () { return new AltAmbiguityParserImplicitOccurrence(); }).to.throw("2");
        (0, chai_1.expect)(function () { return new AltAmbiguityParserImplicitOccurrence(); }).to.throw("<PlusTok> may appears as a prefix path");
    });
    context("IGNORE_AMBIGUITIES flag", function () {
        it("will ignore specific alternative ambiguity", function () {
            var IgnoreAlternativeAmbiguitiesFlagParser = /** @class */ (function (_super) {
                __extends(IgnoreAlternativeAmbiguitiesFlagParser, _super);
                function IgnoreAlternativeAmbiguitiesFlagParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, [PlusTok, StarTok]) || this;
                    _this.noneLastEmpty = _this.RULE("noneLastEmpty", function () {
                        _this.OR([
                            {
                                IGNORE_AMBIGUITIES: true,
                                ALT: function () {
                                    _this.CONSUME1(PlusTok);
                                    _this.CONSUME1(StarTok);
                                }
                            },
                            {
                                ALT: function () {
                                    _this.CONSUME2(PlusTok);
                                    _this.CONSUME2(StarTok);
                                }
                            }
                        ]);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return IgnoreAlternativeAmbiguitiesFlagParser;
            }(parser_traits_1.EmbeddedActionsParser));
            (0, chai_1.expect)(function () { return new IgnoreAlternativeAmbiguitiesFlagParser(); }).to.not.throw();
        });
        it("will ignore all alternation ambiguities", function () {
            var IgnoreAlternationAmbiguitiesFlagParser = /** @class */ (function (_super) {
                __extends(IgnoreAlternationAmbiguitiesFlagParser, _super);
                function IgnoreAlternationAmbiguitiesFlagParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, [PlusTok, StarTok]) || this;
                    _this.noneLastEmpty = _this.RULE("noneLastEmpty", function () {
                        _this.OR({
                            IGNORE_AMBIGUITIES: true,
                            DEF: [
                                {
                                    ALT: function () {
                                        _this.CONSUME1(PlusTok);
                                        _this.CONSUME1(StarTok);
                                    }
                                },
                                {
                                    ALT: function () {
                                        _this.CONSUME2(PlusTok);
                                        _this.CONSUME2(StarTok);
                                    }
                                },
                                {
                                    ALT: function () {
                                        _this.CONSUME3(PlusTok);
                                        _this.CONSUME3(StarTok);
                                    }
                                }
                            ]
                        });
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return IgnoreAlternationAmbiguitiesFlagParser;
            }(parser_traits_1.EmbeddedActionsParser));
            (0, chai_1.expect)(function () { return new IgnoreAlternationAmbiguitiesFlagParser(); }).to.not.throw();
        });
    });
    it("will throw an error when an empty alternative is not the last alternative #2", function () {
        var EmptyAltAmbiguityParser2 = /** @class */ (function (_super) {
            __extends(EmptyAltAmbiguityParser2, _super);
            function EmptyAltAmbiguityParser2(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [PlusTok, StarTok]) || this;
                _this.noneLastEmpty = _this.RULE("noneLastEmpty", function () {
                    _this.OR([
                        // using OR without occurrence suffix, test to check for fix for https://github.com/chevrotain/chevrotain/issues/101
                        {
                            ALT: (0, parser_1.EMPTY_ALT)()
                        },
                        {
                            ALT: function () {
                                _this.CONSUME1(PlusTok);
                            }
                        },
                        {
                            ALT: function () {
                                _this.CONSUME2(StarTok);
                            }
                        }
                    ]);
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return EmptyAltAmbiguityParser2;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new EmptyAltAmbiguityParser2(); }).to.throw("Ambiguous empty alternative");
        (0, chai_1.expect)(function () { return new EmptyAltAmbiguityParser2(); }).to.throw("1");
        (0, chai_1.expect)(function () { return new EmptyAltAmbiguityParser2(); }).to.throw("Only the last alternative may be an empty alternative.");
        (0, chai_1.expect)(function () { return new EmptyAltAmbiguityParser2(); }).to.not.throw("undefined");
    });
});
describe("The prefix ambiguity detection full flow", function () {
    it("will throw an error when an a common prefix ambiguity is detected - categories", function () {
        var A = (0, tokens_public_1.createToken)({ name: "A" });
        var B = (0, tokens_public_1.createToken)({ name: "B", categories: A });
        var C = (0, tokens_public_1.createToken)({ name: "C" });
        var PrefixAltAmbiguity = /** @class */ (function (_super) {
            __extends(PrefixAltAmbiguity, _super);
            function PrefixAltAmbiguity(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [A, B, C]) || this;
                _this.prefixAltAmbiguity = _this.RULE("prefixAltAmbiguity", function () {
                    _this.OR3([
                        {
                            ALT: function () {
                                _this.CONSUME1(B);
                                _this.CONSUME1(A);
                            }
                        },
                        {
                            ALT: function () {
                                _this.CONSUME2(A);
                                _this.CONSUME3(A);
                                _this.CONSUME1(C);
                            }
                        }
                    ]);
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return PrefixAltAmbiguity;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new PrefixAltAmbiguity(); }).to.throw("OR3");
        (0, chai_1.expect)(function () { return new PrefixAltAmbiguity(); }).to.throw("Ambiguous alternatives");
        (0, chai_1.expect)(function () { return new PrefixAltAmbiguity(); }).to.throw("due to common lookahead prefix");
        (0, chai_1.expect)(function () { return new PrefixAltAmbiguity(); }).to.throw("<B, A>");
        (0, chai_1.expect)(function () { return new PrefixAltAmbiguity(); }).to.throw("https://chevrotain.io/docs/guide/resolving_grammar_errors.html#COMMON_PREFIX");
    });
    it("will throw an error when an an alts ambiguity is detected", function () {
        var OneTok = (0, tokens_public_1.createToken)({ name: "OneTok" });
        var TwoTok = (0, tokens_public_1.createToken)({ name: "TwoTok" });
        var Comma = (0, tokens_public_1.createToken)({ name: "Comma" });
        var ALL_TOKENS = [OneTok, TwoTok, Comma];
        var AlternativesAmbiguityParser = /** @class */ (function (_super) {
            __extends(AlternativesAmbiguityParser, _super);
            function AlternativesAmbiguityParser() {
                var _this = _super.call(this, ALL_TOKENS, {
                    maxLookahead: 4
                }) || this;
                _this.main = _this.RULE("main", function () {
                    _this.OR([
                        { ALT: function () { return _this.SUBRULE(_this.alt1); } },
                        { ALT: function () { return _this.SUBRULE(_this.alt2); } }
                    ]);
                });
                _this.alt1 = _this.RULE("alt1", function () {
                    _this.MANY(function () {
                        _this.CONSUME(Comma);
                    });
                    _this.CONSUME(OneTok);
                });
                _this.alt2 = _this.RULE("alt2", function () {
                    _this.MANY(function () {
                        _this.CONSUME(Comma);
                    });
                    _this.CONSUME(TwoTok);
                });
                _this.performSelfAnalysis();
                return _this;
            }
            return AlternativesAmbiguityParser;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new AlternativesAmbiguityParser(); }).to.throw("Ambiguous Alternatives Detected: <1 ,2>");
        (0, chai_1.expect)(function () { return new AlternativesAmbiguityParser(); }).to.throw("in <OR> inside <main> Rule");
        (0, chai_1.expect)(function () { return new AlternativesAmbiguityParser(); }).to.throw("Comma, Comma, Comma, Comma");
        (0, chai_1.expect)(function () { return new AlternativesAmbiguityParser(); }).to.throw("https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES");
    });
    it("will throw an error when an an alts ambiguity is detected - Categories", function () {
        var A = (0, tokens_public_1.createToken)({ name: "A" });
        var B = (0, tokens_public_1.createToken)({ name: "B" });
        var C = (0, tokens_public_1.createToken)({ name: "C" });
        var D = (0, tokens_public_1.createToken)({ name: "D", categories: C });
        var ALL_TOKENS = [A, B, C, D];
        var AlternativesAmbiguityParser = /** @class */ (function (_super) {
            __extends(AlternativesAmbiguityParser, _super);
            function AlternativesAmbiguityParser() {
                var _this = _super.call(this, ALL_TOKENS, {
                    maxLookahead: 4
                }) || this;
                _this.main = _this.RULE("main", function () {
                    _this.OR([
                        { ALT: function () { return _this.SUBRULE(_this.alt1); } },
                        { ALT: function () { return _this.SUBRULE(_this.alt2); } }
                    ]);
                });
                _this.alt1 = _this.RULE("alt1", function () {
                    _this.MANY(function () {
                        _this.CONSUME(D);
                    });
                    _this.CONSUME(A);
                });
                _this.alt2 = _this.RULE("alt2", function () {
                    _this.MANY(function () {
                        _this.CONSUME(C);
                    });
                    _this.CONSUME(B);
                });
                _this.performSelfAnalysis();
                return _this;
            }
            return AlternativesAmbiguityParser;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new AlternativesAmbiguityParser(); }).to.throw("Ambiguous Alternatives Detected: <1 ,2>");
        (0, chai_1.expect)(function () { return new AlternativesAmbiguityParser(); }).to.throw("in <OR> inside <main> Rule");
        (0, chai_1.expect)(function () { return new AlternativesAmbiguityParser(); }).to.throw("D, D, D, D");
        (0, chai_1.expect)(function () { return new AlternativesAmbiguityParser(); }).to.throw("https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES");
    });
    // TODO: detect these ambiguity with categories
    it("will throw an error when an a common prefix ambiguity is detected - implicit occurrence idx", function () {
        var PrefixAltAmbiguity2 = /** @class */ (function (_super) {
            __extends(PrefixAltAmbiguity2, _super);
            function PrefixAltAmbiguity2(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [PlusTok, MinusTok, StarTok]) || this;
                _this.prefixAltAmbiguity = _this.RULE("prefixAltAmbiguity", function () {
                    _this.OR([
                        {
                            ALT: function () {
                                _this.CONSUME1(PlusTok);
                                _this.CONSUME1(MinusTok);
                            }
                        },
                        {
                            ALT: function () {
                                _this.CONSUME2(PlusTok);
                                _this.CONSUME2(MinusTok);
                                _this.CONSUME1(StarTok);
                            }
                        }
                    ]);
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return PrefixAltAmbiguity2;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new PrefixAltAmbiguity2(); }).to.throw("OR");
        (0, chai_1.expect)(function () { return new PrefixAltAmbiguity2(); }).to.throw("Ambiguous alternatives");
        (0, chai_1.expect)(function () { return new PrefixAltAmbiguity2(); }).to.throw("due to common lookahead prefix");
        (0, chai_1.expect)(function () { return new PrefixAltAmbiguity2(); }).to.throw("<PlusTok, MinusTok>");
        (0, chai_1.expect)(function () { return new PrefixAltAmbiguity2(); }).to.throw("https://chevrotain.io/docs/guide/resolving_grammar_errors.html#COMMON_PREFIX");
    });
});
describe("The namespace conflict detection full flow", function () {
    it("will throw an error when a Terminal and a NoneTerminal have the same name", function () {
        var Bamba = /** @class */ (function () {
            function Bamba() {
            }
            Bamba.PATTERN = /NA/;
            return Bamba;
        }());
        var A = /** @class */ (function () {
            function A() {
            }
            A.PATTERN = /NA/;
            return A;
        }());
        var NameSpaceConflict = /** @class */ (function (_super) {
            __extends(NameSpaceConflict, _super);
            function NameSpaceConflict(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [Bamba, A]) || this;
                _this.Bamba = _this.RULE("Bamba", function () {
                    _this.CONSUME(A);
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return NameSpaceConflict;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new NameSpaceConflict([]); }).to.throw("The grammar has both a Terminal(Token) and a Non-Terminal(Rule) named: <Bamba>");
    });
});
describe("The no non-empty lookahead validation", function () {
    it("will throw an error when there are no non-empty lookaheads for AT_LEAST_ONE", function () {
        var EmptyLookaheadParserAtLeastOne = /** @class */ (function (_super) {
            __extends(EmptyLookaheadParserAtLeastOne, _super);
            function EmptyLookaheadParserAtLeastOne(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [PlusTok]) || this;
                _this.someRule = _this.RULE("someRule", function () { return _this.AT_LEAST_ONE(function () { }); });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return EmptyLookaheadParserAtLeastOne;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new EmptyLookaheadParserAtLeastOne(); }).to.throw("The repetition <AT_LEAST_ONE>");
        (0, chai_1.expect)(function () { return new EmptyLookaheadParserAtLeastOne(); }).to.throw("<someRule> can never consume any tokens");
    });
    it("will throw an error when there are no non-empty lookaheads for AT_LEAST_ONE_SEP", function () {
        var EmptyLookaheadParserAtLeastOneSep = /** @class */ (function (_super) {
            __extends(EmptyLookaheadParserAtLeastOneSep, _super);
            function EmptyLookaheadParserAtLeastOneSep(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [PlusTok]) || this;
                _this.someRule = _this.RULE("someRule", function () {
                    return _this.AT_LEAST_ONE_SEP5({
                        SEP: PlusTok,
                        DEF: function () { }
                    });
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return EmptyLookaheadParserAtLeastOneSep;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new EmptyLookaheadParserAtLeastOneSep(); }).to.throw("The repetition <AT_LEAST_ONE_SEP5>");
        (0, chai_1.expect)(function () { return new EmptyLookaheadParserAtLeastOneSep(); }).to.throw("within Rule <someRule>");
    });
    it("will throw an error when there are no non-empty lookaheads for MANY", function () {
        var EmptyLookaheadParserMany = /** @class */ (function (_super) {
            __extends(EmptyLookaheadParserMany, _super);
            function EmptyLookaheadParserMany(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [PlusTok]) || this;
                _this.someRule = _this.RULE("someRule", function () { return _this.MANY2(function () { }); });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return EmptyLookaheadParserMany;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new EmptyLookaheadParserMany(); }).to.throw("The repetition <MANY2>");
        (0, chai_1.expect)(function () { return new EmptyLookaheadParserMany(); }).to.throw("<someRule> can never consume any tokens");
    });
    it("will throw an error when there are no non-empty lookaheads for MANY_SEP", function () {
        var EmptyLookaheadParserManySep = /** @class */ (function (_super) {
            __extends(EmptyLookaheadParserManySep, _super);
            function EmptyLookaheadParserManySep(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [PlusTok]) || this;
                _this.someRule = _this.RULE("someRule", function () {
                    return _this.MANY_SEP3({
                        SEP: PlusTok,
                        DEF: function () { }
                    });
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return EmptyLookaheadParserManySep;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new EmptyLookaheadParserManySep(); }).to.throw("The repetition <MANY_SEP3>");
        (0, chai_1.expect)(function () { return new EmptyLookaheadParserManySep(); }).to.throw("within Rule <someRule>");
    });
});
//# sourceMappingURL=checks_spec.js.map