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
exports.parser = void 0;
var chevrotain_1 = require("chevrotain");
var Token1 = (0, chevrotain_1.createToken)({
    name: "Token1",
    pattern: /TOKEN1/
});
var Token2 = (0, chevrotain_1.createToken)({
    name: "Token2",
    pattern: /TOKEN2/
});
var TestParser = /** @class */ (function (_super) {
    __extends(TestParser, _super);
    function TestParser() {
        var _this = _super.call(this, [Token1, Token2]) || this;
        _this.testRule = _this.RULE("testRule", function () {
            _this.CONSUME(Token1);
            _this.OPTION(function () { return _this.CONSUME(Token2); });
        });
        _this.performSelfAnalysis();
        return _this;
    }
    return TestParser;
}(chevrotain_1.CstParser));
exports.parser = new TestParser();
//# sourceMappingURL=input.js.map