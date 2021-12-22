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
var chai_1 = require("chai");
var api_1 = require("../src/api");
var parser_traits_1 = require("../src/parse/parser/traits/parser_traits");
describe("Chevrotain's runtime deprecation checks", function () {
    it("Will throw an error if someone tries to use the deprecated Parser class", function () {
        (0, chai_1.expect)(function () { return new api_1.Parser(); }).to.throw("The Parser class has been deprecated");
        (0, chai_1.expect)(function () { return new api_1.Parser(); }).to.throw("CstParser or EmbeddedActionsParser");
        (0, chai_1.expect)(function () { return new api_1.Parser(); }).to.throw("https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_7-0-0");
    });
    it("Will throw an error if someone tries to use the deprecated Parser class", function () {
        var tokA = (0, api_1.createToken)({ name: "foo", pattern: "bar" });
        var StaticSelfAnalysisParser = /** @class */ (function (_super) {
            __extends(StaticSelfAnalysisParser, _super);
            function StaticSelfAnalysisParser() {
                var _this = _super.call(this, [tokA]) || this;
                parser_traits_1.CstParser.performSelfAnalysis();
                return _this;
            }
            return StaticSelfAnalysisParser;
        }(parser_traits_1.CstParser));
        (0, chai_1.expect)(function () { return new StaticSelfAnalysisParser(); }).to.throw("The **static** `performSelfAnalysis` method has been deprecated");
    });
});
//# sourceMappingURL=deprecation_spec.js.map