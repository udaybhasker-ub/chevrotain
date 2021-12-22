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
var tokens_public_1 = require("../../../src/scan/tokens_public");
var chai_1 = require("chai");
describe("The Recognizer's Configuration", function () {
    it("default config values - empty config", function () {
        var A = (0, tokens_public_1.createToken)({ name: "A" });
        var InvalidNodeLocationTrackingOption = /** @class */ (function (_super) {
            __extends(InvalidNodeLocationTrackingOption, _super);
            function InvalidNodeLocationTrackingOption() {
                return _super.call(this, [A], { nodeLocationTracking: "oops" }) || this;
            }
            return InvalidNodeLocationTrackingOption;
        }(parser_traits_1.CstParser));
        (0, chai_1.expect)(function () { return new InvalidNodeLocationTrackingOption(); }).to.throw('Invalid <nodeLocationTracking> config option: "oops"');
    });
    it("default config values - empty config", function () {
        var A = (0, tokens_public_1.createToken)({ name: "A" });
        var EmptyConfigParser = /** @class */ (function (_super) {
            __extends(EmptyConfigParser, _super);
            function EmptyConfigParser() {
                return _super.call(this, [A], {}) || this;
            }
            return EmptyConfigParser;
        }(parser_traits_1.EmbeddedActionsParser));
        var parser = new EmptyConfigParser();
        (0, chai_1.expect)(parser.recoveryEnabled).to.be.false;
        (0, chai_1.expect)(parser.maxLookahead).to.equal(3);
        (0, chai_1.expect)(parser.nodeLocationTracking).to.be.equal("none");
    });
    it("default config values - no config", function () {
        var A = (0, tokens_public_1.createToken)({ name: "A" });
        var NoConfigParser = /** @class */ (function (_super) {
            __extends(NoConfigParser, _super);
            function NoConfigParser() {
                return _super.call(this, [A]) || this;
            }
            return NoConfigParser;
        }(parser_traits_1.EmbeddedActionsParser));
        var parser = new NoConfigParser();
        (0, chai_1.expect)(parser.recoveryEnabled).to.be.false;
        (0, chai_1.expect)(parser.maxLookahead).to.equal(3);
        (0, chai_1.expect)(parser.nodeLocationTracking).to.be.equal("none");
    });
    it("default config values - no config", function () {
        var A = (0, tokens_public_1.createToken)({ name: "A" });
        var invalidConfig = { ignoredIssues: {} };
        var IgnoredIssuesParser = /** @class */ (function (_super) {
            __extends(IgnoredIssuesParser, _super);
            function IgnoredIssuesParser() {
                return _super.call(this, [A], invalidConfig) || this;
            }
            return IgnoredIssuesParser;
        }(parser_traits_1.EmbeddedActionsParser));
        (0, chai_1.expect)(function () { return new IgnoredIssuesParser(); }).to.throw("The <ignoredIssues> IParserConfig property has been deprecated");
    });
});
//# sourceMappingURL=recognizer_config_spec.js.map