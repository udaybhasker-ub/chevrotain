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
var tokens_public_1 = require("../../src/scan/tokens_public");
var parser_traits_1 = require("../../src/parse/parser/traits/parser_traits");
var tokens_1 = require("../../src/scan/tokens");
var matchers_1 = require("../utils/matchers");
var map_1 = __importDefault(require("lodash/map"));
var chai_1 = require("chai");
function createTokenVector(tokTypes) {
    return (0, map_1.default)(tokTypes, function (curTokType) {
        return (0, matchers_1.createRegularToken)(curTokType);
    });
}
var tokenStructuredMatcher = tokens_1.tokenStructuredMatcher;
function defineTestSuite(recoveryMode) {
    context("CST Recovery: ".concat(recoveryMode), function () {
        var A;
        var B;
        var C;
        var D;
        var E;
        var ALL_TOKENS;
        before(function () {
            A = (0, tokens_public_1.createToken)({ name: "A" });
            B = (0, tokens_public_1.createToken)({ name: "B" });
            C = (0, tokens_public_1.createToken)({ name: "C" });
            D = (0, tokens_public_1.createToken)({ name: "D" });
            E = (0, tokens_public_1.createToken)({ name: "E" });
            ALL_TOKENS = [A, B, C, D, E];
        });
        it("Can output a CST for a flat structure", function () {
            var CstTerminalParser = /** @class */ (function (_super) {
                __extends(CstTerminalParser, _super);
                function CstTerminalParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, ALL_TOKENS, { recoveryEnabled: recoveryMode }) || this;
                    _this.testRule = _this.RULE("testRule", function () {
                        _this.CONSUME(A);
                        _this.CONSUME(B);
                        _this.SUBRULE(_this.bamba);
                    });
                    _this.bamba = _this.RULE("bamba", function () {
                        _this.CONSUME(C);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return CstTerminalParser;
            }(parser_traits_1.CstParser));
            var input = [
                (0, matchers_1.createRegularToken)(A),
                (0, matchers_1.createRegularToken)(B),
                (0, matchers_1.createRegularToken)(C)
            ];
            var parser = new CstTerminalParser(input);
            var cst = parser.testRule();
            (0, chai_1.expect)(cst.name).to.equal("testRule");
            (0, chai_1.expect)(cst.children).to.have.keys("A", "B", "bamba");
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[0], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.B[0], B)).to.be.true;
            (0, chai_1.expect)(cst.children.bamba[0].name).to.equal("bamba");
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.bamba[0].children.C[0], C)).to
                .be.true;
        });
        it("Can output a CST with labels", function () {
            var CstTerminalParser2 = /** @class */ (function (_super) {
                __extends(CstTerminalParser2, _super);
                function CstTerminalParser2(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, ALL_TOKENS, { recoveryEnabled: recoveryMode }) || this;
                    _this.testRule = _this.RULE("testRule", function () {
                        _this.CONSUME(A, { LABEL: "myLabel" });
                        _this.CONSUME(B);
                        _this.SUBRULE(_this.bamba, { LABEL: "myOtherLabel" });
                    });
                    _this.bamba = _this.RULE("bamba", function () {
                        _this.CONSUME(C);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return CstTerminalParser2;
            }(parser_traits_1.CstParser));
            var input = [
                (0, matchers_1.createRegularToken)(A),
                (0, matchers_1.createRegularToken)(B),
                (0, matchers_1.createRegularToken)(C)
            ];
            var parser = new CstTerminalParser2(input);
            var cst = parser.testRule();
            (0, chai_1.expect)(cst.name).to.equal("testRule");
            (0, chai_1.expect)(cst.children).to.have.keys("myLabel", "B", "myOtherLabel");
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.myLabel[0], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.B[0], B)).to.be.true;
            (0, chai_1.expect)(cst.children.myOtherLabel[0].name).to.equal("bamba");
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.myOtherLabel[0].children.C[0], C)).to.be.true;
        });
        it("Can output a CST with labels in recovery", function () {
            var CstTerminalParserWithLabels = /** @class */ (function (_super) {
                __extends(CstTerminalParserWithLabels, _super);
                function CstTerminalParserWithLabels(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, ALL_TOKENS, {
                        recoveryEnabled: true
                    }) || this;
                    _this.testRule = _this.RULE("testRule", function () {
                        _this.CONSUME(A, { LABEL: "myLabel" });
                        _this.CONSUME(B);
                        _this.SUBRULE(_this.bamba, { LABEL: "myOtherLabel" });
                    });
                    _this.bamba = _this.RULE("bamba", function () {
                        _this.CONSUME(C);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return CstTerminalParserWithLabels;
            }(parser_traits_1.CstParser));
            var input = [(0, matchers_1.createRegularToken)(A), (0, matchers_1.createRegularToken)(B)];
            var parser = new CstTerminalParserWithLabels(input);
            var cst = parser.testRule();
            (0, chai_1.expect)(cst.name).to.equal("testRule");
            (0, chai_1.expect)(cst.children).to.have.keys("myLabel", "B", "myOtherLabel");
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.myLabel[0], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.B[0], B)).to.be.true;
            var bamba = cst.children.myOtherLabel[0];
            (0, chai_1.expect)(bamba.name).to.equal("bamba");
            (0, chai_1.expect)(bamba.recoveredNode).to.be.true;
        });
        it("Can output a CST for a Terminal - alternations", function () {
            var CstTerminalAlternationParser = /** @class */ (function (_super) {
                __extends(CstTerminalAlternationParser, _super);
                function CstTerminalAlternationParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, ALL_TOKENS, {
                        recoveryEnabled: recoveryMode
                    }) || this;
                    _this.testRule = _this.RULE("testRule", function () {
                        _this.OR([
                            {
                                ALT: function () {
                                    _this.CONSUME(A);
                                }
                            },
                            {
                                ALT: function () {
                                    _this.CONSUME(B);
                                    _this.SUBRULE(_this.bamba);
                                }
                            }
                        ]);
                    });
                    _this.bamba = _this.RULE("bamba", function () {
                        _this.CONSUME(C);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return CstTerminalAlternationParser;
            }(parser_traits_1.CstParser));
            var input = [(0, matchers_1.createRegularToken)(A)];
            var parser = new CstTerminalAlternationParser(input);
            var cst = parser.testRule();
            (0, chai_1.expect)(cst.name).to.equal("testRule");
            (0, chai_1.expect)(cst.children).to.have.keys("A");
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[0], A)).to.be.true;
            (0, chai_1.expect)(cst.children.bamba).to.be.undefined;
        });
        it("Can output a CST for a Terminal - alternations - single", function () {
            var CstTerminalAlternationSingleAltParser = /** @class */ (function (_super) {
                __extends(CstTerminalAlternationSingleAltParser, _super);
                function CstTerminalAlternationSingleAltParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, ALL_TOKENS, {
                        recoveryEnabled: recoveryMode
                    }) || this;
                    _this.testRule = _this.RULE("testRule", function () {
                        _this.OR([
                            {
                                ALT: function () {
                                    _this.CONSUME(A);
                                    _this.CONSUME(B);
                                }
                            }
                        ]);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return CstTerminalAlternationSingleAltParser;
            }(parser_traits_1.CstParser));
            var input = [(0, matchers_1.createRegularToken)(A), (0, matchers_1.createRegularToken)(B)];
            var parser = new CstTerminalAlternationSingleAltParser(input);
            var cst = parser.testRule();
            (0, chai_1.expect)(cst.name).to.equal("testRule");
            (0, chai_1.expect)(cst.children).to.have.keys("A", "B");
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[0], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.B[0], B)).to.be.true;
        });
        it("Can output a CST for a Terminal with multiple occurrences", function () {
            var CstMultiTerminalParser = /** @class */ (function (_super) {
                __extends(CstMultiTerminalParser, _super);
                function CstMultiTerminalParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, ALL_TOKENS, {
                        recoveryEnabled: recoveryMode
                    }) || this;
                    _this.testRule = _this.RULE("testRule", function () {
                        _this.CONSUME(A);
                        _this.CONSUME(B);
                        _this.CONSUME2(A);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return CstMultiTerminalParser;
            }(parser_traits_1.CstParser));
            var input = [
                (0, matchers_1.createRegularToken)(A),
                (0, matchers_1.createRegularToken)(B),
                (0, matchers_1.createRegularToken)(A)
            ];
            var parser = new CstMultiTerminalParser(input);
            var cst = parser.testRule();
            (0, chai_1.expect)(cst.name).to.equal("testRule");
            (0, chai_1.expect)(cst.children).to.have.keys("A", "B");
            (0, chai_1.expect)(cst.children.A).to.have.length(2);
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[0], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[1], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.B[0], B)).to.be.true;
        });
        it("Can output a CST for a Terminal with multiple occurrences - iteration", function () {
            var CstMultiTerminalWithManyParser = /** @class */ (function (_super) {
                __extends(CstMultiTerminalWithManyParser, _super);
                function CstMultiTerminalWithManyParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, ALL_TOKENS, {
                        recoveryEnabled: recoveryMode
                    }) || this;
                    _this.testRule = _this.RULE("testRule", function () {
                        _this.MANY(function () {
                            _this.CONSUME(A);
                            _this.SUBRULE(_this.bamba);
                        });
                        _this.CONSUME(B);
                    });
                    _this.bamba = _this.RULE("bamba", function () {
                        _this.CONSUME(C);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return CstMultiTerminalWithManyParser;
            }(parser_traits_1.CstParser));
            var input = [
                (0, matchers_1.createRegularToken)(A),
                (0, matchers_1.createRegularToken)(C),
                (0, matchers_1.createRegularToken)(A),
                (0, matchers_1.createRegularToken)(C),
                (0, matchers_1.createRegularToken)(A),
                (0, matchers_1.createRegularToken)(C),
                (0, matchers_1.createRegularToken)(B)
            ];
            var parser = new CstMultiTerminalWithManyParser(input);
            var cst = parser.testRule();
            (0, chai_1.expect)(cst.name).to.equal("testRule");
            (0, chai_1.expect)(cst.children).to.have.keys("A", "B", "bamba");
            (0, chai_1.expect)(cst.children.A).to.have.length(3);
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[0], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[1], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[2], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.B[0], B)).to.be.true;
            (0, chai_1.expect)(cst.children.bamba).to.have.length(3);
            var children = cst.children.bamba;
            (0, chai_1.expect)(tokenStructuredMatcher(children[0].children.C[0], C)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(children[1].children.C[0], C)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(children[2].children.C[0], C)).to.be.true;
        });
        context("Can output a CST for an optional terminal", function () {
            var CstOptionalTerminalParser = /** @class */ (function (_super) {
                __extends(CstOptionalTerminalParser, _super);
                function CstOptionalTerminalParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, ALL_TOKENS, {
                        recoveryEnabled: recoveryMode
                    }) || this;
                    _this.ruleWithOptional = _this.RULE("ruleWithOptional", function () {
                        _this.OPTION(function () {
                            _this.CONSUME(A);
                            _this.SUBRULE(_this.bamba);
                        });
                        _this.CONSUME(B);
                    });
                    _this.bamba = _this.RULE("bamba", function () {
                        _this.CONSUME(C);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return CstOptionalTerminalParser;
            }(parser_traits_1.CstParser));
            it("path taken", function () {
                var input = [
                    (0, matchers_1.createRegularToken)(A),
                    (0, matchers_1.createRegularToken)(C),
                    (0, matchers_1.createRegularToken)(B)
                ];
                var parser = new CstOptionalTerminalParser(input);
                var cst = parser.ruleWithOptional();
                (0, chai_1.expect)(cst.name).to.equal("ruleWithOptional");
                (0, chai_1.expect)(cst.children).to.have.keys("A", "B", "bamba");
                (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[0], A)).to.be.true;
                var bamba = cst.children.bamba[0];
                (0, chai_1.expect)(bamba.name).to.equal("bamba");
                (0, chai_1.expect)(tokenStructuredMatcher(bamba.children.C[0], C)).to.be.true;
                (0, chai_1.expect)(tokenStructuredMatcher(cst.children.B[0], B)).to.be.true;
            });
            it("path NOT taken", function () {
                var input = [(0, matchers_1.createRegularToken)(B)];
                var parser = new CstOptionalTerminalParser(input);
                var cst = parser.ruleWithOptional();
                (0, chai_1.expect)(cst.name).to.equal("ruleWithOptional");
                (0, chai_1.expect)(cst.children).to.have.keys("B");
                (0, chai_1.expect)(cst.children.A).to.be.undefined;
                (0, chai_1.expect)(cst.children.bamba).to.be.undefined;
                (0, chai_1.expect)(tokenStructuredMatcher(cst.children.B[0], B)).to.be.true;
            });
        });
        it("Can output a CST for a Terminal with multiple occurrences - iteration mandatory", function () {
            var CstMultiTerminalWithAtLeastOneParser = /** @class */ (function (_super) {
                __extends(CstMultiTerminalWithAtLeastOneParser, _super);
                function CstMultiTerminalWithAtLeastOneParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, ALL_TOKENS, {
                        recoveryEnabled: recoveryMode
                    }) || this;
                    _this.testRule = _this.RULE("testRule", function () {
                        _this.AT_LEAST_ONE(function () {
                            _this.CONSUME(A);
                        });
                        _this.CONSUME(B);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return CstMultiTerminalWithAtLeastOneParser;
            }(parser_traits_1.CstParser));
            var input = [
                (0, matchers_1.createRegularToken)(A),
                (0, matchers_1.createRegularToken)(A),
                (0, matchers_1.createRegularToken)(A),
                (0, matchers_1.createRegularToken)(B)
            ];
            var parser = new CstMultiTerminalWithAtLeastOneParser(input);
            var cst = parser.testRule();
            (0, chai_1.expect)(cst.name).to.equal("testRule");
            (0, chai_1.expect)(cst.children).to.have.keys("A", "B");
            (0, chai_1.expect)(cst.children.A).to.have.length(3);
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[0], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[1], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[2], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.B[0], B)).to.be.true;
        });
        it("Can output a CST for a Terminal with multiple occurrences - iteration SEP", function () {
            var CstMultiTerminalWithManySepParser = /** @class */ (function (_super) {
                __extends(CstMultiTerminalWithManySepParser, _super);
                function CstMultiTerminalWithManySepParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, ALL_TOKENS, {
                        recoveryEnabled: recoveryMode
                    }) || this;
                    _this.testRule = _this.RULE("testRule", function () {
                        _this.MANY_SEP({
                            SEP: C,
                            DEF: function () {
                                _this.CONSUME(A);
                            }
                        });
                        _this.CONSUME(B);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return CstMultiTerminalWithManySepParser;
            }(parser_traits_1.CstParser));
            var input = [
                (0, matchers_1.createRegularToken)(A),
                (0, matchers_1.createRegularToken)(C),
                (0, matchers_1.createRegularToken)(A),
                (0, matchers_1.createRegularToken)(B)
            ];
            var parser = new CstMultiTerminalWithManySepParser(input);
            var cst = parser.testRule();
            (0, chai_1.expect)(cst.name).to.equal("testRule");
            (0, chai_1.expect)(cst.children).to.have.keys("A", "B", "C");
            (0, chai_1.expect)(cst.children.A).to.have.length(2);
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[0], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[1], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.B[0], B)).to.be.true;
            (0, chai_1.expect)(cst.children.C).to.have.length(1);
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.C[0], C)).to.be.true;
        });
        it("Can output a CST for a Terminal with multiple occurrences - iteration SEP mandatory", function () {
            var CstMultiTerminalWithAtLeastOneSepParser = /** @class */ (function (_super) {
                __extends(CstMultiTerminalWithAtLeastOneSepParser, _super);
                function CstMultiTerminalWithAtLeastOneSepParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, ALL_TOKENS, {
                        recoveryEnabled: recoveryMode
                    }) || this;
                    _this.testRule = _this.RULE("testRule", function () {
                        _this.AT_LEAST_ONE_SEP({
                            SEP: C,
                            DEF: function () {
                                _this.CONSUME(A);
                            }
                        });
                        _this.CONSUME(B);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return CstMultiTerminalWithAtLeastOneSepParser;
            }(parser_traits_1.CstParser));
            var input = [
                (0, matchers_1.createRegularToken)(A),
                (0, matchers_1.createRegularToken)(C),
                (0, matchers_1.createRegularToken)(A),
                (0, matchers_1.createRegularToken)(B)
            ];
            var parser = new CstMultiTerminalWithAtLeastOneSepParser(input);
            var cst = parser.testRule();
            (0, chai_1.expect)(cst.name).to.equal("testRule");
            (0, chai_1.expect)(cst.children).to.have.keys("A", "B", "C");
            (0, chai_1.expect)(cst.children.A).to.have.length(2);
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[0], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.A[1], A)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.B[0], B)).to.be.true;
            (0, chai_1.expect)(cst.children.C).to.have.length(1);
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.C[0], C)).to.be.true;
        });
        it("Can output a CST with node full location information", function () {
            var CstTerminalParser = /** @class */ (function (_super) {
                __extends(CstTerminalParser, _super);
                function CstTerminalParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, ALL_TOKENS, {
                        nodeLocationTracking: "full",
                        recoveryEnabled: recoveryMode
                    }) || this;
                    _this.testRule = _this.RULE("testRule", function () {
                        _this.SUBRULE(_this.first);
                        _this.CONSUME(B);
                        _this.CONSUME(C);
                        _this.SUBRULE(_this.empty);
                        _this.SUBRULE(_this.second);
                    });
                    _this.first = _this.RULE("first", function () {
                        _this.CONSUME(A);
                    });
                    _this.empty = _this.RULE("empty", function () { });
                    _this.second = _this.RULE("second", function () {
                        _this.CONSUME(D);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return CstTerminalParser;
            }(parser_traits_1.CstParser));
            var input = [
                (0, matchers_1.createRegularToken)(A, "", 1, 1, 1, 2, 1, 2),
                (0, matchers_1.createRegularToken)(B, "", 12, 1, 3, 13, 1, 4),
                (0, matchers_1.createRegularToken)(C, "", 15, 2, 10, 16, 3, 15),
                (0, matchers_1.createRegularToken)(D, "", 17, 5, 2, 18, 5, 4)
            ];
            var parser = new CstTerminalParser(input);
            var cst = parser.testRule();
            (0, chai_1.expect)(cst.name).to.equal("testRule");
            (0, chai_1.expect)(cst.children).to.have.keys("B", "C", "first", "empty", "second");
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.B[0], B)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.C[0], C)).to.be.true;
            var first = cst.children.first[0];
            (0, chai_1.expect)(first.name).to.equal("first");
            (0, chai_1.expect)(tokenStructuredMatcher(first.children.A[0], A)).to.be.true;
            (0, chai_1.expect)(first.location).to.deep.equal({
                startOffset: 1,
                startLine: 1,
                startColumn: 1,
                endOffset: 2,
                endLine: 1,
                endColumn: 2
            });
            var second = cst.children.second[0];
            (0, chai_1.expect)(second.name).to.equal("second");
            (0, chai_1.expect)(second.location).to.deep.equal({
                startOffset: 17,
                startLine: 5,
                startColumn: 2,
                endOffset: 18,
                endLine: 5,
                endColumn: 4
            });
            (0, chai_1.expect)(cst.children.empty[0].location).to.deep.equal({
                startOffset: NaN,
                startLine: NaN,
                startColumn: NaN,
                endOffset: NaN,
                endLine: NaN,
                endColumn: NaN
            });
            (0, chai_1.expect)(cst.location).to.deep.equal({
                startOffset: 1,
                startLine: 1,
                startColumn: 1,
                endOffset: 18,
                endLine: 5,
                endColumn: 4
            });
        });
        it("Can output a CST with node onlyOffset location information", function () {
            var CstTerminalParser = /** @class */ (function (_super) {
                __extends(CstTerminalParser, _super);
                function CstTerminalParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, ALL_TOKENS, {
                        nodeLocationTracking: "onlyOffset",
                        recoveryEnabled: recoveryMode
                    }) || this;
                    _this.testRule = _this.RULE("testRule", function () {
                        _this.SUBRULE(_this.first);
                        _this.CONSUME(B);
                        _this.CONSUME(C);
                        _this.SUBRULE(_this.empty);
                        _this.SUBRULE(_this.second);
                    });
                    _this.first = _this.RULE("first", function () {
                        _this.CONSUME(A);
                    });
                    _this.empty = _this.RULE("empty", function () { });
                    _this.second = _this.RULE("second", function () {
                        _this.CONSUME(D);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return CstTerminalParser;
            }(parser_traits_1.CstParser));
            var input = [
                (0, matchers_1.createRegularToken)(A, "1", 1, NaN, NaN, 2),
                (0, matchers_1.createRegularToken)(B, "2", 12, NaN, NaN, 13),
                (0, matchers_1.createRegularToken)(C, "3", 15, NaN, NaN, 16),
                (0, matchers_1.createRegularToken)(D, "4", 17, NaN, NaN, 18)
            ];
            var parser = new CstTerminalParser(input);
            var cst = parser.testRule();
            (0, chai_1.expect)(cst.name).to.equal("testRule");
            (0, chai_1.expect)(cst.children).to.have.keys("B", "C", "first", "empty", "second");
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.B[0], B)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.C[0], C)).to.be.true;
            var first = cst.children.first[0];
            (0, chai_1.expect)(first.name).to.equal("first");
            (0, chai_1.expect)(tokenStructuredMatcher(first.children.A[0], A)).to.be.true;
            (0, chai_1.expect)(first.location).to.deep.equal({
                startOffset: 1,
                endOffset: 2
            });
            var second = cst.children.second[0];
            (0, chai_1.expect)(second.name).to.equal("second");
            (0, chai_1.expect)(second.location).to.deep.equal({
                startOffset: 17,
                endOffset: 18
            });
            (0, chai_1.expect)(cst.children.empty[0].location).to.deep.equal({
                startOffset: NaN,
                endOffset: NaN
            });
            (0, chai_1.expect)(cst.location).to.deep.equal({
                startOffset: 1,
                endOffset: 18
            });
        });
        it("Can output a CST with no location information", function () {
            var CstTerminalParser = /** @class */ (function (_super) {
                __extends(CstTerminalParser, _super);
                function CstTerminalParser(input) {
                    if (input === void 0) { input = []; }
                    var _this = _super.call(this, ALL_TOKENS, {
                        nodeLocationTracking: "none",
                        recoveryEnabled: recoveryMode
                    }) || this;
                    _this.testRule = _this.RULE("testRule", function () {
                        _this.SUBRULE(_this.first);
                        _this.CONSUME(B);
                        _this.CONSUME(C);
                        _this.SUBRULE(_this.second);
                    });
                    _this.first = _this.RULE("first", function () {
                        _this.CONSUME(A);
                    });
                    _this.second = _this.RULE("second", function () {
                        _this.CONSUME(D);
                    });
                    _this.performSelfAnalysis();
                    _this.input = input;
                    return _this;
                }
                return CstTerminalParser;
            }(parser_traits_1.CstParser));
            var input = [
                (0, matchers_1.createRegularToken)(A, "", 1, 1, 1, 2, 1, 2),
                (0, matchers_1.createRegularToken)(B, "", 12, 1, 3, 13, 1, 4),
                (0, matchers_1.createRegularToken)(C, "", 15, 2, 10, 16, 3, 15),
                (0, matchers_1.createRegularToken)(D, "", 17, 5, 2, 18, 5, 4)
            ];
            var parser = new CstTerminalParser(input);
            var cst = parser.testRule();
            (0, chai_1.expect)(cst.name).to.equal("testRule");
            (0, chai_1.expect)(cst.children).to.have.keys("B", "C", "first", "second");
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.B[0], B)).to.be.true;
            (0, chai_1.expect)(tokenStructuredMatcher(cst.children.C[0], C)).to.be.true;
            var first = cst.children.first[0];
            (0, chai_1.expect)(first.name).to.equal("first");
            (0, chai_1.expect)(tokenStructuredMatcher(first.children.A[0], A)).to.be.true;
            (0, chai_1.expect)(first.location).to.be.undefined;
            var second = cst.children.second[0];
            (0, chai_1.expect)(second.name).to.equal("second");
            (0, chai_1.expect)(second.location).to.be.undefined;
            (0, chai_1.expect)(cst.location).to.be.undefined;
        });
        context("Error Recovery", function () {
            it("re-sync recovery", function () {
                var CstRecoveryParserReSync = /** @class */ (function (_super) {
                    __extends(CstRecoveryParserReSync, _super);
                    function CstRecoveryParserReSync(input) {
                        if (input === void 0) { input = []; }
                        var _this = _super.call(this, ALL_TOKENS, {
                            recoveryEnabled: true
                        }) || this;
                        _this.root = _this.RULE("root", function () {
                            _this.MANY(function () {
                                _this.OR([
                                    {
                                        ALT: function () {
                                            _this.SUBRULE(_this.first);
                                        }
                                    },
                                    {
                                        ALT: function () {
                                            _this.SUBRULE(_this.second);
                                        }
                                    }
                                ]);
                            });
                        });
                        _this.first = _this.RULE("first", function () {
                            _this.CONSUME(A);
                            _this.CONSUME(B);
                        });
                        _this.second = _this.RULE("second", function () {
                            _this.CONSUME(C);
                            _this.CONSUME(D);
                        });
                        _this.performSelfAnalysis();
                        _this.input = input;
                        return _this;
                    }
                    CstRecoveryParserReSync.prototype.canTokenTypeBeInsertedInRecovery = function (tokType) {
                        // we want to force re-sync recovery
                        return false;
                    };
                    return CstRecoveryParserReSync;
                }(parser_traits_1.CstParser));
                var input = createTokenVector([A, E, E, C, D]);
                var parser = new CstRecoveryParserReSync(input);
                var cst = parser.root();
                (0, chai_1.expect)(parser.errors).to.have.lengthOf(1);
                (0, chai_1.expect)(parser.errors[0].message).to.include("Expecting token of type --> B <--");
                (0, chai_1.expect)(parser.errors[0].resyncedTokens).to.have.lengthOf(1);
                (0, chai_1.expect)(tokenStructuredMatcher(parser.errors[0].resyncedTokens[0], E)).to
                    .be.true;
                // expect(parser.errors[0]).
                (0, chai_1.expect)(cst.name).to.equal("root");
                (0, chai_1.expect)(cst.children).to.have.keys("first", "second");
                var firstCollection = cst.children.first;
                (0, chai_1.expect)(firstCollection).to.have.lengthOf(1);
                var first = firstCollection[0];
                (0, chai_1.expect)(first.recoveredNode).to.be.true;
                (0, chai_1.expect)(first.children).to.have.keys("A");
                (0, chai_1.expect)(tokenStructuredMatcher(first.children.A[0], A)).to.be.true;
                (0, chai_1.expect)(first.children.B).to.be.undefined;
                var secondCollection = cst.children.second;
                (0, chai_1.expect)(secondCollection).to.have.lengthOf(1);
                var second = secondCollection[0];
                (0, chai_1.expect)(second.recoveredNode).to.be.undefined;
                (0, chai_1.expect)(second.children).to.have.keys("C", "D");
                (0, chai_1.expect)(tokenStructuredMatcher(second.children.C[0], C)).to.be.true;
                (0, chai_1.expect)(tokenStructuredMatcher(second.children.D[0], D)).to.be.true;
            });
            it("re-sync recovery nested", function () {
                var CstRecoveryParserReSyncNested = /** @class */ (function (_super) {
                    __extends(CstRecoveryParserReSyncNested, _super);
                    function CstRecoveryParserReSyncNested(input) {
                        if (input === void 0) { input = []; }
                        var _this = _super.call(this, ALL_TOKENS, {
                            recoveryEnabled: true
                        }) || this;
                        _this.root = _this.RULE("root", function () {
                            _this.MANY(function () {
                                _this.OR([
                                    {
                                        ALT: function () {
                                            _this.SUBRULE(_this.first_root);
                                        }
                                    },
                                    {
                                        ALT: function () {
                                            _this.SUBRULE(_this.second);
                                        }
                                    }
                                ]);
                            });
                        });
                        _this.first_root = _this.RULE("first_root", function () {
                            _this.SUBRULE(_this.first);
                        });
                        _this.first = _this.RULE("first", function () {
                            _this.CONSUME(A);
                            _this.CONSUME(B);
                        });
                        _this.second = _this.RULE("second", function () {
                            _this.CONSUME(C);
                            _this.CONSUME(D);
                        });
                        _this.performSelfAnalysis();
                        _this.input = input;
                        return _this;
                    }
                    CstRecoveryParserReSyncNested.prototype.canTokenTypeBeInsertedInRecovery = function (tokType) {
                        // we want to force re-sync recovery
                        return false;
                    };
                    return CstRecoveryParserReSyncNested;
                }(parser_traits_1.CstParser));
                var input = createTokenVector([A, E, E, C, D]);
                var parser = new CstRecoveryParserReSyncNested(input);
                var cst = parser.root();
                (0, chai_1.expect)(parser.errors).to.have.lengthOf(1);
                (0, chai_1.expect)(parser.errors[0].message).to.include("Expecting token of type --> B <--");
                (0, chai_1.expect)(parser.errors[0].resyncedTokens).to.have.lengthOf(1);
                (0, chai_1.expect)(tokenStructuredMatcher(parser.errors[0].resyncedTokens[0], E)).to
                    .be.true;
                (0, chai_1.expect)(cst.name).to.equal("root");
                (0, chai_1.expect)(cst.children).to.have.keys("first_root", "second");
                var firstRootCollection = cst.children.first_root;
                (0, chai_1.expect)(firstRootCollection).to.have.lengthOf(1);
                var firstRoot = firstRootCollection[0];
                (0, chai_1.expect)(firstRoot.children).to.have.keys("first");
                var first = firstRoot.children.first[0];
                (0, chai_1.expect)(first.recoveredNode).to.be.true;
                (0, chai_1.expect)(first.children).to.have.keys("A");
                (0, chai_1.expect)(tokenStructuredMatcher(first.children.A[0], A)).to.be.true;
                (0, chai_1.expect)(first.children.B).to.be.undefined;
                var secondCollection = cst.children.second;
                (0, chai_1.expect)(secondCollection).to.have.lengthOf(1);
                var second = secondCollection[0];
                (0, chai_1.expect)(second.recoveredNode).to.be.undefined;
                (0, chai_1.expect)(second.children).to.have.keys("C", "D");
                (0, chai_1.expect)(tokenStructuredMatcher(second.children.C[0], C)).to.be.true;
                (0, chai_1.expect)(tokenStructuredMatcher(second.children.D[0], D)).to.be.true;
            });
        });
    });
}
defineTestSuite(true);
defineTestSuite(false);
//# sourceMappingURL=cst_spec.js.map