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
var tokens_public_1 = require("../../../src/scan/tokens_public");
var parser_traits_1 = require("../../../src/parse/parser/traits/parser_traits");
var chai_1 = require("chai");
describe("Chevrotain's Init Performance Tracing", function () {
    var consoleLogSpy;
    beforeEach(function () {
        // @ts-ignore
        consoleLogSpy = sinon.spy(console, "log");
    });
    afterEach(function () {
        // @ts-ignore
        console.log.restore();
    });
    var TracerParserConstructor;
    before(function () {
        var PlusTok = (0, tokens_public_1.createToken)({ name: "PlusTok" });
        var TraceParser = /** @class */ (function (_super) {
            __extends(TraceParser, _super);
            function TraceParser(traceInitVal) {
                var _this = _super.call(this, [PlusTok], {
                    traceInitPerf: traceInitVal
                }) || this;
                _this.topRule = _this.RULE("topRule", function () {
                    _this.CONSUME(PlusTok);
                });
                _this.performSelfAnalysis();
                return _this;
            }
            return TraceParser;
        }(parser_traits_1.EmbeddedActionsParser));
        TracerParserConstructor = TraceParser;
    });
    it("Will not trace with traceInitPerf = false", function () {
        new TracerParserConstructor(false);
        (0, chai_1.expect)(consoleLogSpy).to.have.not.been.called;
    });
    it("Will trace nested with traceInitPerf = true", function () {
        new TracerParserConstructor(true);
        (0, chai_1.expect)(consoleLogSpy).to.have.been.called;
        (0, chai_1.expect)(consoleLogSpy.args[0][0]).to.include("--> <performSelfAnalysis>");
        (0, chai_1.expect)(consoleLogSpy.args[1][0]).to.include("\t--> <toFastProps>");
    });
    it("Will trace one level with traceInitPerf = 1", function () {
        new TracerParserConstructor(1);
        (0, chai_1.expect)(consoleLogSpy).to.have.been.called;
        (0, chai_1.expect)(consoleLogSpy.args[0][0]).to.include("--> <performSelfAnalysis>");
        (0, chai_1.expect)(consoleLogSpy.args[1][0]).to.not.include("\t");
    });
    it("Will trace 2 levels with traceInitPerf = 2", function () {
        new TracerParserConstructor(2);
        (0, chai_1.expect)(consoleLogSpy).to.have.been.called;
        (0, chai_1.expect)(consoleLogSpy.args[0][0]).to.include("--> <performSelfAnalysis>");
        (0, chai_1.expect)(consoleLogSpy.args[1][0]).to.include("\t");
    });
});
//# sourceMappingURL=perf_tracer_spec.js.map