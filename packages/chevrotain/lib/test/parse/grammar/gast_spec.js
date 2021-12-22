"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gast_1 = require("../../../src/parse/grammar/gast/gast");
var tokens_public_1 = require("../../../src/scan/tokens_public");
var gast_public_1 = require("../../../src/parse/grammar/gast/gast_public");
var chai_1 = require("chai");
describe("GAst namespace", function () {
    describe("the ProdRef class", function () {
        it("will always return a valid empty definition, even if it's ref is unresolved", function () {
            var prodRef = new gast_public_1.NonTerminal({
                nonTerminalName: "SomeGrammarRuleName"
            });
            (0, chai_1.expect)(prodRef.definition).to.be.an.instanceof(Array);
        });
        it("cannot be used to re-set the referenced Rule's definition", function () {
            var myRule = new gast_public_1.Rule({ name: "myRule", definition: [] });
            var prodRef = new gast_public_1.NonTerminal({
                nonTerminalName: "myRule",
                referencedRule: myRule
            });
            (0, chai_1.expect)(prodRef.definition).to.be.be.empty;
            prodRef.definition = [new gast_public_1.Alternation({ definition: [] })];
            (0, chai_1.expect)(prodRef.definition).to.be.be.empty;
        });
    });
    describe("the mappings between a GAst instance and its matching DSL method name for: ", function () {
        var Comma = /** @class */ (function () {
            function Comma() {
            }
            Comma.PATTERN = /NA/;
            return Comma;
        }());
        it("Terminal", function () {
            var gastInstance = new gast_public_1.Terminal({ terminalType: Comma });
            (0, chai_1.expect)((0, gast_1.getProductionDslName)(gastInstance)).to.equal("CONSUME");
        });
        it("NonTerminal", function () {
            var gastInstance = new gast_public_1.NonTerminal({
                nonTerminalName: "bamba"
            });
            (0, chai_1.expect)((0, gast_1.getProductionDslName)(gastInstance)).to.equal("SUBRULE");
        });
        it("Option", function () {
            var gastInstance = new gast_public_1.Option({ definition: [] });
            (0, chai_1.expect)((0, gast_1.getProductionDslName)(gastInstance)).to.equal("OPTION");
        });
        it("Alternation", function () {
            var gastInstance = new gast_public_1.Alternation({ definition: [] });
            (0, chai_1.expect)((0, gast_1.getProductionDslName)(gastInstance)).to.equal("OR");
        });
        it("RepetitionMandatory", function () {
            var gastInstance = new gast_public_1.RepetitionMandatory({ definition: [] });
            (0, chai_1.expect)((0, gast_1.getProductionDslName)(gastInstance)).to.equal("AT_LEAST_ONE");
        });
        it("RepetitionMandatoryWithSeparator", function () {
            var gastInstance = new gast_public_1.RepetitionMandatoryWithSeparator({
                definition: [],
                separator: Comma
            });
            (0, chai_1.expect)((0, gast_1.getProductionDslName)(gastInstance)).to.equal("AT_LEAST_ONE_SEP");
        });
        it("RepetitionWithSeparator", function () {
            var gastInstance = new gast_public_1.RepetitionWithSeparator({
                definition: [],
                separator: Comma
            });
            (0, chai_1.expect)((0, gast_1.getProductionDslName)(gastInstance)).to.equal("MANY_SEP");
        });
        it("Repetition", function () {
            var gastInstance = new gast_public_1.Repetition({ definition: [] });
            (0, chai_1.expect)((0, gast_1.getProductionDslName)(gastInstance)).to.equal("MANY");
        });
    });
    describe("the GAst serialization capabilities", function () {
        var A;
        var B;
        var C;
        var D;
        var Comma;
        var WithLiteral;
        before(function () {
            A = (0, tokens_public_1.createToken)({ name: "A" });
            A.LABEL = "bamba";
            B = (0, tokens_public_1.createToken)({ name: "B", pattern: /[a-zA-Z]\w*/ });
            C = (0, tokens_public_1.createToken)({ name: "C" });
            D = (0, tokens_public_1.createToken)({ name: "D" });
            Comma = (0, tokens_public_1.createToken)({ name: "Comma" });
            WithLiteral = (0, tokens_public_1.createToken)({
                name: "WithLiteral",
                pattern: "bamba"
            });
        });
        it("can serialize a NonTerminal", function () {
            var input = new gast_public_1.NonTerminal({
                nonTerminalName: "qualifiedName"
            });
            var actual = (0, gast_public_1.serializeProduction)(input);
            (0, chai_1.expect)(actual).to.deep.equal({
                type: "NonTerminal",
                name: "qualifiedName",
                idx: 1
            });
        });
        it("can serialize a Alternative", function () {
            var input = new gast_public_1.Alternative({
                definition: [
                    new gast_public_1.Terminal({ terminalType: WithLiteral }),
                    new gast_public_1.NonTerminal({ nonTerminalName: "bamba" })
                ]
            });
            var actual = (0, gast_public_1.serializeProduction)(input);
            (0, chai_1.expect)(actual).to.deep.equal({
                type: "Alternative",
                definition: [
                    {
                        type: "Terminal",
                        name: "WithLiteral",
                        pattern: "bamba",
                        label: "WithLiteral",
                        idx: 1
                    },
                    {
                        type: "NonTerminal",
                        name: "bamba",
                        idx: 1
                    }
                ]
            });
        });
        it("can serialize a Option", function () {
            var input = new gast_public_1.Option({
                definition: [
                    new gast_public_1.Terminal({ terminalType: C }),
                    new gast_public_1.NonTerminal({ nonTerminalName: "bamba" })
                ]
            });
            var actual = (0, gast_public_1.serializeProduction)(input);
            (0, chai_1.expect)(actual).to.deep.equal({
                type: "Option",
                idx: 1,
                definition: [
                    {
                        type: "Terminal",
                        name: "C",
                        label: "C",
                        idx: 1
                    },
                    {
                        type: "NonTerminal",
                        name: "bamba",
                        idx: 1
                    }
                ]
            });
        });
        it("can serialize a RepetitionMandatory", function () {
            var input = new gast_public_1.RepetitionMandatory({
                definition: [
                    new gast_public_1.Terminal({ terminalType: C }),
                    new gast_public_1.NonTerminal({ nonTerminalName: "bamba" })
                ]
            });
            var actual = (0, gast_public_1.serializeProduction)(input);
            (0, chai_1.expect)(actual).to.deep.equal({
                type: "RepetitionMandatory",
                idx: 1,
                definition: [
                    {
                        type: "Terminal",
                        name: "C",
                        label: "C",
                        idx: 1
                    },
                    {
                        type: "NonTerminal",
                        name: "bamba",
                        idx: 1
                    }
                ]
            });
        });
        it("can serialize a RepetitionMandatoryWithSeparator", function () {
            var input = new gast_public_1.RepetitionMandatoryWithSeparator({
                definition: [
                    new gast_public_1.Terminal({ terminalType: C }),
                    new gast_public_1.NonTerminal({ nonTerminalName: "bamba" })
                ],
                separator: Comma
            });
            var actual = (0, gast_public_1.serializeProduction)(input);
            (0, chai_1.expect)(actual).to.deep.equal({
                type: "RepetitionMandatoryWithSeparator",
                idx: 1,
                separator: {
                    type: "Terminal",
                    name: "Comma",
                    label: "Comma",
                    idx: 1
                },
                definition: [
                    {
                        type: "Terminal",
                        name: "C",
                        label: "C",
                        idx: 1
                    },
                    {
                        type: "NonTerminal",
                        name: "bamba",
                        idx: 1
                    }
                ]
            });
        });
        it("can serialize a Repetition", function () {
            var input = new gast_public_1.Repetition({
                definition: [
                    new gast_public_1.Terminal({ terminalType: C }),
                    new gast_public_1.NonTerminal({ nonTerminalName: "bamba" })
                ]
            });
            var actual = (0, gast_public_1.serializeProduction)(input);
            (0, chai_1.expect)(actual).to.deep.equal({
                type: "Repetition",
                idx: 1,
                definition: [
                    {
                        type: "Terminal",
                        name: "C",
                        label: "C",
                        idx: 1
                    },
                    {
                        type: "NonTerminal",
                        name: "bamba",
                        idx: 1
                    }
                ]
            });
        });
        it("can serialize a RepetitionWithSeparator", function () {
            var input = new gast_public_1.RepetitionWithSeparator({
                definition: [
                    new gast_public_1.Terminal({ terminalType: C }),
                    new gast_public_1.NonTerminal({ nonTerminalName: "bamba" })
                ],
                separator: Comma
            });
            var actual = (0, gast_public_1.serializeProduction)(input);
            (0, chai_1.expect)(actual).to.deep.equal({
                type: "RepetitionWithSeparator",
                idx: 1,
                separator: {
                    type: "Terminal",
                    name: "Comma",
                    label: "Comma",
                    idx: 1
                },
                definition: [
                    {
                        type: "Terminal",
                        name: "C",
                        label: "C",
                        idx: 1
                    },
                    {
                        type: "NonTerminal",
                        name: "bamba",
                        idx: 1
                    }
                ]
            });
        });
        it("can serialize a Alternation", function () {
            var input = new gast_public_1.Alternation({
                definition: [
                    new gast_public_1.Alternative({
                        definition: [new gast_public_1.Terminal({ terminalType: A })]
                    }),
                    new gast_public_1.Alternative({
                        definition: [new gast_public_1.Terminal({ terminalType: B })]
                    }),
                    new gast_public_1.Alternative({
                        definition: [new gast_public_1.Terminal({ terminalType: C })]
                    })
                ]
            });
            var actual = (0, gast_public_1.serializeProduction)(input);
            (0, chai_1.expect)(actual).to.deep.equal({
                type: "Alternation",
                idx: 1,
                definition: [
                    {
                        type: "Alternative",
                        definition: [
                            {
                                type: "Terminal",
                                name: "A",
                                label: "bamba",
                                idx: 1
                            }
                        ]
                    },
                    {
                        type: "Alternative",
                        definition: [
                            {
                                type: "Terminal",
                                name: "B",
                                label: "B",
                                pattern: "[a-zA-Z]\\w*",
                                idx: 1
                            }
                        ]
                    },
                    {
                        type: "Alternative",
                        definition: [
                            {
                                type: "Terminal",
                                name: "C",
                                label: "C",
                                idx: 1
                            }
                        ]
                    }
                ]
            });
        });
        it("can serialize a Terminal with a custom label", function () {
            var input = new gast_public_1.Terminal({ terminalType: C, label: "someLabel" });
            var actual = (0, gast_public_1.serializeProduction)(input);
            (0, chai_1.expect)(actual).to.deep.equal({
                type: "Terminal",
                name: "C",
                terminalLabel: "someLabel",
                label: "C",
                idx: 1
            });
        });
        it("can serialize a Terminal with a custom token label", function () {
            var input = new gast_public_1.Terminal({ terminalType: A });
            var actual = (0, gast_public_1.serializeProduction)(input);
            (0, chai_1.expect)(actual).to.deep.equal({
                type: "Terminal",
                name: "A",
                label: "bamba",
                idx: 1
            });
        });
        it("can serialize a Terminal with a pattern", function () {
            var input = new gast_public_1.Terminal({ terminalType: B });
            var actual = (0, gast_public_1.serializeProduction)(input);
            (0, chai_1.expect)(actual).to.deep.equal({
                type: "Terminal",
                name: "B",
                label: "B",
                pattern: "[a-zA-Z]\\w*",
                idx: 1
            });
        });
        it("can serialize a NonTerminal with a label", function () {
            var input = new gast_public_1.NonTerminal({
                nonTerminalName: "qualifiedName",
                label: "someLabel"
            });
            var actual = (0, gast_public_1.serializeProduction)(input);
            (0, chai_1.expect)(actual).to.deep.equal({
                type: "NonTerminal",
                name: "qualifiedName",
                label: "someLabel",
                idx: 1
            });
        });
        it("can serialize a Rule", function () {
            var input = new gast_public_1.Rule({
                name: "myRule",
                orgText: "",
                definition: [
                    new gast_public_1.Terminal({ terminalType: C }),
                    new gast_public_1.NonTerminal({ nonTerminalName: "bamba" })
                ]
            });
            var actual = (0, gast_public_1.serializeProduction)(input);
            (0, chai_1.expect)(actual).to.deep.equal({
                type: "Rule",
                name: "myRule",
                orgText: "",
                definition: [
                    {
                        type: "Terminal",
                        name: "C",
                        label: "C",
                        idx: 1
                    },
                    {
                        type: "NonTerminal",
                        name: "bamba",
                        idx: 1
                    }
                ]
            });
        });
        it("can serialize an array of Rules", function () {
            var input = [
                new gast_public_1.Rule({
                    name: "myRule",
                    orgText: "",
                    definition: [
                        new gast_public_1.Terminal({ terminalType: C }),
                        new gast_public_1.NonTerminal({ nonTerminalName: "bamba" })
                    ]
                }),
                new gast_public_1.Rule({
                    name: "myRule2",
                    orgText: "",
                    definition: [
                        new gast_public_1.Terminal({ terminalType: D }),
                        new gast_public_1.NonTerminal({ nonTerminalName: "bisli" })
                    ]
                })
            ];
            var actual = (0, gast_public_1.serializeGrammar)(input);
            (0, chai_1.expect)(actual).to.deep.equal([
                {
                    type: "Rule",
                    name: "myRule",
                    orgText: "",
                    definition: [
                        {
                            type: "Terminal",
                            name: "C",
                            label: "C",
                            idx: 1
                        },
                        {
                            type: "NonTerminal",
                            name: "bamba",
                            idx: 1
                        }
                    ]
                },
                {
                    type: "Rule",
                    orgText: "",
                    name: "myRule2",
                    definition: [
                        {
                            type: "Terminal",
                            name: "D",
                            label: "D",
                            idx: 1
                        },
                        {
                            type: "NonTerminal",
                            name: "bisli",
                            idx: 1
                        }
                    ]
                }
            ]);
        });
    });
});
//# sourceMappingURL=gast_spec.js.map