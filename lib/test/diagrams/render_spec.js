"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var version_1 = require("../../src/version");
var createSyntaxDiagramsCode = require("../../src/api").createSyntaxDiagramsCode;
var sql_recovery_parser_1 = require("../full_flow/error_recovery/sql_statements/sql_recovery_parser");
// more in depth testing will require jsdom to support SVG elements (WIP).
// This test-suite takes about 50% of the whole tests execution time :(
describe("The Chevrotain diagrams rendering APIs", function () {
    // The JSDom tests that actually perform network traffic seem unstable...
    this.retries(4);
    var serializedGrammar;
    before(function () {
        serializedGrammar =
            new sql_recovery_parser_1.DDLExampleRecoveryParser().getSerializedGastProductions();
    });
    it("Produces valid and executable html text with custom options", function (done) {
        this.timeout(20000);
        var jsdom = require("jsdom");
        var JSDOM = jsdom.JSDOM;
        var htmlText = createSyntaxDiagramsCode(serializedGrammar, {
            resourceBase: "https://cdn.jsdelivr.net/npm/chevrotain/diagrams/",
            css: "https://cdn.jsdelivr.net/npm/chevrotain/diagrams/diagrams.css"
        });
        var dom = new JSDOM(htmlText, {
            runScripts: "dangerously",
            resources: "usable"
        });
        var document = dom.window.document;
        document.addEventListener("DOMContentLoaded", function () {
            try {
                (0, chai_1.expect)(document.scripts.length).to.equal(6);
                (0, chai_1.expect)(document.scripts.item(1).src).to.include("jsdelivr");
                (0, chai_1.expect)(document.getElementById("diagrams")).to.not.equal(null);
                done();
            }
            catch (e) {
                done(e);
            }
        }, false);
    });
    it("Produces valid and executable html text", function (done) {
        this.timeout(20000);
        var jsdom = require("jsdom");
        var JSDOM = jsdom.JSDOM;
        var htmlText = createSyntaxDiagramsCode(serializedGrammar);
        // using a version in the url will fail in release build as the new version number has not been deployed yet.
        htmlText = htmlText.replace(new RegExp("@".concat(version_1.VERSION), "g"), "");
        var dom = new JSDOM(htmlText, {
            runScripts: "dangerously",
            resources: "usable"
        });
        var document = dom.window.document;
        document.addEventListener("DOMContentLoaded", function () {
            try {
                (0, chai_1.expect)(document.scripts.length).to.equal(6);
                (0, chai_1.expect)(document.scripts.item(1).src).to.include("unpkg");
                (0, chai_1.expect)(document.getElementById("diagrams")).to.not.equal(null);
                done();
            }
            catch (e) {
                done(e);
            }
        }, false);
    });
});
//# sourceMappingURL=render_spec.js.map