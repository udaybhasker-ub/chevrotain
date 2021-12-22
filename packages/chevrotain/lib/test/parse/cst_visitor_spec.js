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
var matchers_1 = require("../utils/matchers");
var keys_1 = __importDefault(require("lodash/keys"));
var chai_1 = require("chai");
describe("The CSTVisitor", function () {
    var BaseVisitor;
    var parserInstance;
    var BaseVisitorWithDefaults;
    var A;
    var B;
    var C;
    // to avoid issues with other tests clearing the cache
    before(function () {
        A = (0, tokens_public_1.createToken)({ name: "A" });
        B = (0, tokens_public_1.createToken)({ name: "B" });
        C = (0, tokens_public_1.createToken)({ name: "C" });
        var ALL_TOKENS = [A, B, C];
        var CstTerminalParserReturnVisitor = /** @class */ (function (_super) {
            __extends(CstTerminalParserReturnVisitor, _super);
            function CstTerminalParserReturnVisitor(input) {
                if (input === void 0) { input = []; }
                var _this = _super.call(this, ALL_TOKENS, {}) || this;
                _this.testRule = _this.RULE("testRule", function () {
                    _this.CONSUME(A);
                    _this.CONSUME(B);
                    _this.OPTION({
                        DEF: function () {
                            _this.SUBRULE(_this.bamba);
                        }
                    });
                });
                _this.bamba = _this.RULE("bamba", function () {
                    _this.CONSUME(C);
                });
                _this.performSelfAnalysis();
                return _this;
            }
            return CstTerminalParserReturnVisitor;
        }(parser_traits_1.CstParser));
        parserInstance = new CstTerminalParserReturnVisitor([]);
        BaseVisitor = parserInstance.getBaseCstVisitorConstructor();
        BaseVisitorWithDefaults =
            parserInstance.getBaseCstVisitorConstructorWithDefaults();
        parserInstance = new CstTerminalParserReturnVisitor([]);
        BaseVisitor = parserInstance.getBaseCstVisitorConstructor();
        BaseVisitorWithDefaults =
            parserInstance.getBaseCstVisitorConstructorWithDefaults();
        // to hit all coverage branches
        BaseVisitorWithDefaults =
            parserInstance.getBaseCstVisitorConstructorWithDefaults();
    });
    it("can execute a Visitor with a return Value", function () {
        var CstVisitorValidator = /** @class */ (function (_super) {
            __extends(CstVisitorValidator, _super);
            function CstVisitorValidator() {
                var _this = _super.call(this) || this;
                _this.validateVisitor();
                return _this;
            }
            CstVisitorValidator.prototype.testRule = function (ctx) {
                (0, chai_1.expect)((0, keys_1.default)(ctx)).to.deep.equal(["A", "B", "bamba"]);
                return this.visit(ctx.bamba[0]);
            };
            CstVisitorValidator.prototype.bamba = function (ctx) {
                (0, chai_1.expect)((0, keys_1.default)(ctx)).to.deep.equal(["C"]);
                return 666;
            };
            return CstVisitorValidator;
        }(BaseVisitor));
        var input = [
            (0, matchers_1.createRegularToken)(A),
            (0, matchers_1.createRegularToken)(B),
            (0, matchers_1.createRegularToken)(C)
        ];
        parserInstance.input = input;
        var cst = parserInstance.testRule();
        var visitor = new CstVisitorValidator();
        (0, chai_1.expect)(visitor.visit(cst)).to.equal(666);
    });
    it("can execute a Visitor with an 'in' param", function () {
        var CstVisitorValidator = /** @class */ (function (_super) {
            __extends(CstVisitorValidator, _super);
            function CstVisitorValidator() {
                var _this = _super.call(this) || this;
                _this.validateVisitor();
                return _this;
            }
            CstVisitorValidator.prototype.testRule = function (ctx, param) {
                (0, chai_1.expect)((0, keys_1.default)(ctx)).to.deep.equal(["A", "B", "bamba"]);
                return this.visit(ctx.bamba[0], param);
            };
            CstVisitorValidator.prototype.bamba = function (ctx, param) {
                // inspecting handling of optional arguments
                (0, chai_1.expect)(this.visit(ctx.missingKey)).to.be.undefined;
                (0, chai_1.expect)((0, keys_1.default)(ctx)).to.deep.equal(["C"]);
                return 666 + param;
            };
            return CstVisitorValidator;
        }(BaseVisitor));
        var input = [
            (0, matchers_1.createRegularToken)(A),
            (0, matchers_1.createRegularToken)(B),
            (0, matchers_1.createRegularToken)(C)
        ];
        parserInstance.input = input;
        var cst = parserInstance.testRule();
        var visitor = new CstVisitorValidator();
        (0, chai_1.expect)(visitor.visit(cst, 1)).to.equal(667);
    });
    it("can create a visitor with default methods implementations", function () {
        var visited = false;
        var CstVisitorValidator = /** @class */ (function (_super) {
            __extends(CstVisitorValidator, _super);
            function CstVisitorValidator() {
                var _this = _super.call(this) || this;
                _this.validateVisitor();
                return _this;
            }
            CstVisitorValidator.prototype.bamba = function (ctx) {
                (0, chai_1.expect)((0, keys_1.default)(ctx)).to.deep.equal(["C"]);
                visited = true;
            };
            return CstVisitorValidator;
        }(BaseVisitorWithDefaults));
        var input = [
            (0, matchers_1.createRegularToken)(A),
            (0, matchers_1.createRegularToken)(B),
            (0, matchers_1.createRegularToken)(C)
        ];
        parserInstance.input = input;
        var cst = parserInstance.testRule();
        var visitor = new CstVisitorValidator();
        visitor.visit(cst);
        (0, chai_1.expect)(visited).to.be.true;
    });
    it("can invoke visit with an array", function () {
        var CstVisitorValidator = /** @class */ (function (_super) {
            __extends(CstVisitorValidator, _super);
            function CstVisitorValidator() {
                var _this = _super.call(this) || this;
                _this.validateVisitor();
                return _this;
            }
            CstVisitorValidator.prototype.testRule = function (ctx, param) {
                (0, chai_1.expect)((0, keys_1.default)(ctx)).to.deep.equal(["A", "B", "bamba"]);
                return this.visit(ctx["bamba"], param);
            };
            CstVisitorValidator.prototype.bamba = function (ctx, param) {
                (0, chai_1.expect)((0, keys_1.default)(ctx)).to.deep.equal(["C"]);
                return 666 + param;
            };
            return CstVisitorValidator;
        }(BaseVisitor));
        var input = [
            (0, matchers_1.createRegularToken)(A),
            (0, matchers_1.createRegularToken)(B),
            (0, matchers_1.createRegularToken)(C)
        ];
        parserInstance.input = input;
        var cst = parserInstance.testRule();
        var visitor = new CstVisitorValidator();
        (0, chai_1.expect)(visitor.visit([cst], 1)).to.equal(667);
        (0, chai_1.expect)(visitor.visit([], 1)).to.be.undefined;
    });
    it("can detect missing visitor methods", function () {
        var CstVisitorValidator = /** @class */ (function (_super) {
            __extends(CstVisitorValidator, _super);
            function CstVisitorValidator() {
                var _this = _super.call(this) || this;
                _this.validateVisitor();
                return _this;
            }
            CstVisitorValidator.prototype.testRule = function (ctx, param) { };
            return CstVisitorValidator;
        }(BaseVisitor));
        (0, chai_1.expect)(function () { return new CstVisitorValidator(); }).to.throw("Missing visitor method: <bamba>");
        (0, chai_1.expect)(function () { return new CstVisitorValidator(); }).to.throw("Errors Detected in CST Visitor");
    });
    it("can detect redundant visitor methods", function () {
        var CstVisitorValidatorRedundant = /** @class */ (function (_super) {
            __extends(CstVisitorValidatorRedundant, _super);
            function CstVisitorValidatorRedundant() {
                var _this = _super.call(this) || this;
                _this.validateVisitor();
                return _this;
            }
            CstVisitorValidatorRedundant.prototype.testRule = function (ctx, param) { };
            CstVisitorValidatorRedundant.prototype.bamba = function (ctx, param) { };
            CstVisitorValidatorRedundant.prototype.oops = function (ctx, param) { };
            return CstVisitorValidatorRedundant;
        }(BaseVisitor));
        (0, chai_1.expect)(function () { return new CstVisitorValidatorRedundant(); }).to.throw("Redundant visitor method: <oops>");
        (0, chai_1.expect)(function () { return new CstVisitorValidatorRedundant(); }).to.throw("Errors Detected in CST Visitor");
    });
});
//# sourceMappingURL=cst_visitor_spec.js.map