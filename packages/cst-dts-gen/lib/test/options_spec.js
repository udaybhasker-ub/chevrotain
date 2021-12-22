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
var api_1 = require("../src/api");
var chevrotain_1 = require("chevrotain");
var chai_1 = require("chai");
describe("The DTS generator", function () {
    it("can generate nothing", function () {
        var result = genDts({
            includeTypes: false,
            includeVisitorInterface: false
        });
        (0, chai_1.expect)(result).to.equal("");
    });
    it("can generate only cst types", function () {
        var result = genDts({
            includeTypes: true,
            includeVisitorInterface: false
        });
        (0, chai_1.expect)(result).to.not.include("export interface ICstNodeVisitor");
        (0, chai_1.expect)(result).to.include("export interface TestRuleCstNode");
        (0, chai_1.expect)(result).to.include("export type TestRuleCstChildren");
    });
    it("can generate only cst visitor", function () {
        var result = genDts({
            includeTypes: false,
            includeVisitorInterface: true
        });
        (0, chai_1.expect)(result).to.include("export interface ICstNodeVisitor");
        (0, chai_1.expect)(result).to.not.include("export interface TestRuleCstNode");
        (0, chai_1.expect)(result).to.not.include("export type TestRuleCstChildren");
    });
    it("can generate a cst visitor with specific name", function () {
        var result = genDts({
            includeTypes: false,
            includeVisitorInterface: true,
            visitorInterfaceName: "ITestCstVisitor"
        });
        (0, chai_1.expect)(result).to.include("export interface ITestCstVisitor");
        (0, chai_1.expect)(result).to.not.include("export interface ICstNodeVisitor");
    });
    function genDts(options) {
        var parser = new TestParser();
        return (0, api_1.generateCstDts)(parser, options);
    }
});
var TestToken = (0, chevrotain_1.createToken)({
    name: "TestToken",
    pattern: /TESTTOKEN/
});
var TestParser = /** @class */ (function (_super) {
    __extends(TestParser, _super);
    function TestParser() {
        var _this = _super.call(this, [TestToken]) || this;
        _this.testRule = _this.RULE("testRule", function () {
            _this.CONSUME(TestToken);
        });
        _this.performSelfAnalysis();
        return _this;
    }
    return TestParser;
}(chevrotain_1.CstParser));
//# sourceMappingURL=options_spec.js.map