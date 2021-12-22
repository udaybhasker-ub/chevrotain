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
var chai_1 = require("chai");
describe("The Recognizer's capabilities for overriding grammar productions", function () {
    var PlusTok = /** @class */ (function () {
        function PlusTok() {
        }
        PlusTok.PATTERN = /\+/;
        return PlusTok;
    }());
    var MinusTok = /** @class */ (function () {
        function MinusTok() {
        }
        MinusTok.PATTERN = /-/;
        return MinusTok;
    }());
    before(function () {
        (0, tokens_1.augmentTokenTypes)([PlusTok, MinusTok]);
    });
    it("Can override an existing rule", function () {
        var SuperOverrideParser = /** @class */ (function (_super) {
            __extends(SuperOverrideParser, _super);
            function SuperOverrideParser(isInvokedByChildConstructor) {
                if (isInvokedByChildConstructor === void 0) { isInvokedByChildConstructor = false; }
                var _this = _super.call(this, [PlusTok, MinusTok], {}) || this;
                _this.topRule = _this.RULE("topRule", function () {
                    var result;
                    _this.OPTION(function () {
                        result = _this.SUBRULE(_this.nestedRule);
                    });
                    return result;
                });
                _this.nestedRule = _this.RULE("nestedRule", function () {
                    _this.CONSUME(PlusTok);
                    return "yey";
                });
                // performSelfAnalysis should only be invoked once.
                if (!isInvokedByChildConstructor) {
                    _this.performSelfAnalysis();
                }
                return _this;
            }
            return SuperOverrideParser;
        }(parser_traits_1.EmbeddedActionsParser));
        var ChildOverrideParser = /** @class */ (function (_super) {
            __extends(ChildOverrideParser, _super);
            function ChildOverrideParser() {
                var _this = _super.call(this, true) || this;
                // nestedRule is overridden with a new implementation
                _this.nestedRule = _this.OVERRIDE_RULE("nestedRule", function () {
                    _this.AT_LEAST_ONE(function () {
                        _this.CONSUME(MinusTok);
                    });
                    return "ney";
                });
                _this.performSelfAnalysis();
                return _this;
            }
            return ChildOverrideParser;
        }(SuperOverrideParser));
        var superParser = new SuperOverrideParser();
        superParser.input = [(0, matchers_1.createRegularToken)(PlusTok)];
        var superResult = superParser.topRule();
        (0, chai_1.expect)(superResult).to.equal("yey");
        (0, chai_1.expect)(superParser.errors).to.be.empty;
        var childParser = new ChildOverrideParser();
        childParser.input = [
            (0, matchers_1.createRegularToken)(MinusTok),
            (0, matchers_1.createRegularToken)(MinusTok),
            (0, matchers_1.createRegularToken)(MinusTok)
        ];
        var childResult = childParser.topRule();
        (0, chai_1.expect)(childResult).to.equal("ney");
        (0, chai_1.expect)(superParser.errors).to.be.empty;
    });
    it("Can not override a rule which does not exist", function () {
        var InvalidOverrideParser = /** @class */ (function (_super) {
            __extends(InvalidOverrideParser, _super);
            function InvalidOverrideParser(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, [PlusTok, MinusTok]) || this;
                // nothing to override, oops does not exist in any of the super grammars
                _this.oops = _this.OVERRIDE_RULE("oops", function () {
                    _this.CONSUME(PlusTok);
                    return "poof";
                }, { recoveryValueFunc: function () { return "boom"; } });
                _this.performSelfAnalysis();
                return _this;
            }
            return InvalidOverrideParser;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new InvalidOverrideParser([]); }).to.throw("Parser Definition Errors detected");
        (0, chai_1.expect)(function () { return new InvalidOverrideParser([]); }).to.throw("Invalid rule override");
        (0, chai_1.expect)(function () { return new InvalidOverrideParser([]); }).to.throw("->oops<-");
    });
});
//# sourceMappingURL=rules_override_spec.js.map