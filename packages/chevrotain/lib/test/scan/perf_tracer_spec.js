"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_public_1 = require("../../src/scan/lexer_public");
var chai_1 = require("chai");
describe("Chevrotain's Lexer Init Performance Tracing", function () {
    var consoleLogSpy;
    beforeEach(function () {
        // @ts-ignore
        consoleLogSpy = sinon.spy(console, "log");
    });
    afterEach(function () {
        // @ts-ignore
        console.log.restore();
    });
    it("Will not trace with traceInitPerf = false", function () {
        new lexer_public_1.Lexer([], { traceInitPerf: false });
        (0, chai_1.expect)(consoleLogSpy).to.have.not.been.called;
    });
    it("Will trace nested with traceInitPerf = true", function () {
        new lexer_public_1.Lexer([], { traceInitPerf: true });
        (0, chai_1.expect)(consoleLogSpy).to.have.been.called;
        (0, chai_1.expect)(consoleLogSpy.args[0][0]).to.include("--> <Lexer Constructor>");
        (0, chai_1.expect)(consoleLogSpy.args[1][0]).to.include("\t--> <Lexer Config handling>");
    });
    it("Will trace one level with traceInitPerf = 1", function () {
        new lexer_public_1.Lexer([], { traceInitPerf: 1 });
        (0, chai_1.expect)(consoleLogSpy).to.have.been.called;
        (0, chai_1.expect)(consoleLogSpy.args[0][0]).to.include("--> <Lexer Constructor>");
        (0, chai_1.expect)(consoleLogSpy.args[1][0]).to.not.include("\t");
    });
    it("Will trace 2 levels with traceInitPerf = 2", function () {
        new lexer_public_1.Lexer([], { traceInitPerf: 2 });
        (0, chai_1.expect)(consoleLogSpy).to.have.been.called;
        (0, chai_1.expect)(consoleLogSpy.args[0][0]).to.include("--> <Lexer Constructor>");
        (0, chai_1.expect)(consoleLogSpy.args[1][0]).to.include("\t");
    });
});
//# sourceMappingURL=perf_tracer_spec.js.map