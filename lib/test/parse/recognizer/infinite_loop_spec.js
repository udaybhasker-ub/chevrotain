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
Object.defineProperty(exports, "__esModule", { value: true });
var parser_traits_1 = require("../../../src/parse/parser/traits/parser_traits");
var matchers_1 = require("../../utils/matchers");
var tokens_1 = require("../../../src/scan/tokens");
var tokens_public_1 = require("../../../src/scan/tokens_public");
var parser_1 = require("../../../src/parse/parser/parser");
var chai_1 = require("chai");
describe("The Recognizer's capabilities for detecting / handling infinite loops", function () {
    it("Will gracefully 'escape' from an infinite loop in a repetition", function () {
        var PlusTok = /** @class */ (function () {
            function PlusTok() {
            }
            PlusTok.PATTERN = /\+/;
            return PlusTok;
        }());
        (0, tokens_1.augmentTokenTypes)([PlusTok]);
        var InfiniteLoopParser = /** @class */ (function (_super) {
            __extends(InfiniteLoopParser, _super);
            function InfiniteLoopParser(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [PlusTok]) || this;
                _this.counter = 0;
                _this.loop = _this.RULE("loop", function () {
                    _this.MANY(function () {
                        // By returning without consuming any tokens we could
                        // cause an infinite loop as the looahead for re-entering the `MANY`
                        // would still be true.
                        if (_this.counter > 0) {
                            // A bit of a hack to skip over the `return` once
                            // So the Grammar Recording will process the grammar correctly
                            // Otherwise a different error would occur
                            // (detection of empty repetition at GAST level).
                            return;
                        }
                        _this.counter++;
                        _this.CONSUME(PlusTok);
                    });
                });
                _this.performSelfAnalysis();
                _this.input = input;
                return _this;
            }
            return InfiniteLoopParser;
        }(parser_traits_1.EmbeddedActionsParser));
        var parser = new InfiniteLoopParser();
        parser.input = [(0, matchers_1.createRegularToken)(PlusTok)];
        var parseResult = parser.loop();
        (0, chai_1.expect)(parser.errors[0].message).to.match(/Redundant input, expecting EOF but found/);
    });
    it("Will gracefully 'escape' from an infinite loop in a repetition issue #956", function () {
        var Semi = (0, tokens_public_1.createToken)({ name: "Semi", pattern: /;/, label: ";" });
        var A = (0, tokens_public_1.createToken)({ name: "A", pattern: /A/i });
        var B = (0, tokens_public_1.createToken)({ name: "B", pattern: /B/i });
        var C = (0, tokens_public_1.createToken)({ name: "C", pattern: /C/i });
        var allTokens = [Semi, A, B, C];
        var InfParser = /** @class */ (function (_super) {
            __extends(InfParser, _super);
            function InfParser() {
                var _this = _super.call(this, allTokens, {
                    recoveryEnabled: true
                }) || this;
                _this.block = _this.RULE("block", function () {
                    _this.MANY(function () {
                        _this.SUBRULE(_this.command);
                    });
                });
                _this.command = _this.RULE("command", function () {
                    _this.OR([
                        { ALT: function () { return _this.SUBRULE(_this.ab); } },
                        { ALT: function () { return _this.SUBRULE(_this.ac); } }
                    ]);
                    _this.CONSUME(Semi);
                });
                _this.ab = _this.RULE("ab", function () {
                    _this.CONSUME(A);
                    _this.CONSUME(B);
                });
                _this.ac = _this.RULE("ac", function () {
                    _this.CONSUME(A);
                    _this.CONSUME(C);
                });
                _this.performSelfAnalysis();
                return _this;
            }
            return InfParser;
        }(parser_traits_1.EmbeddedActionsParser));
        var parser = new InfParser();
        parser.input = [(0, matchers_1.createRegularToken)(A)];
        var parseResult = parser.block();
        (0, chai_1.expect)(parser.errors[0].message).to.match(/Expecting: one of these possible Token sequences:/);
        (0, chai_1.expect)(parser.errors[0].message).to.match(/[A, B]/);
        (0, chai_1.expect)(parser.errors[0].message).to.match(/[A, C]/);
    });
    it("Will enter an infinite loop during parser initialization when there is an empty alternative inside nested repetitionn", function () {
        // ----------------- lexer -----------------
        var Comma = (0, tokens_public_1.createToken)({ name: "Comma", pattern: /,/ });
        var Comma2 = (0, tokens_public_1.createToken)({ name: "Comma", pattern: /,/ });
        var allTokens = [Comma];
        var NestedManyEmptyAltBugParser = /** @class */ (function (_super) {
            __extends(NestedManyEmptyAltBugParser, _super);
            function NestedManyEmptyAltBugParser() {
                var _this = _super.call(this, allTokens) || this;
                _this.A = _this.RULE("A", function () {
                    _this.MANY(function () {
                        _this.SUBRULE(_this.B);
                    });
                });
                _this.B = _this.RULE("B", function () {
                    _this.MANY(function () {
                        _this.SUBRULE(_this.C);
                    });
                });
                _this.C = _this.RULE("C", function () {
                    _this.OR([
                        { ALT: function () { return _this.CONSUME(Comma); } },
                        {
                            ALT: (0, parser_1.EMPTY_ALT)()
                        }
                    ]);
                });
                _this.performSelfAnalysis();
                return _this;
            }
            return NestedManyEmptyAltBugParser;
        }(parser_traits_1.CstParser));
        (0, chai_1.expect)(function () { return new NestedManyEmptyAltBugParser(); }).to.not.throw();
    });
});
//# sourceMappingURL=infinite_loop_spec.js.map