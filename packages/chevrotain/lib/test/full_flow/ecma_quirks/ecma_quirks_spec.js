"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var ecma_quirks_1 = require("./ecma_quirks");
describe("ECMAScript Quirks Example (ScannerLess Mode)", function () {
    it("can parse a valid text successfully", function () {
        var result = (0, ecma_quirks_1.parse)("return ;");
        (0, chai_1.expect)(result.errors).to.be.empty;
    });
    it("can parse a valid text successfully #2", function () {
        var result = (0, ecma_quirks_1.parse)("return 1;");
        (0, chai_1.expect)(result.errors).to.be.empty;
    });
    it("can parse a valid text successfully #3 - Division", function () {
        var result = (0, ecma_quirks_1.parse)("return 8 / 2 ;");
        (0, chai_1.expect)(result.errors).to.be.empty;
    });
    it("can parse a valid text successfully #3 - RegExp", function () {
        var result = (0, ecma_quirks_1.parse)("return /123/ ;");
        (0, chai_1.expect)(result.errors).to.be.empty;
    });
    it("can parse a valid text successfully #3 - RegExp and Division", function () {
        var result = (0, ecma_quirks_1.parse)("return /123/ / 5 ;");
        (0, chai_1.expect)(result.errors).to.be.empty;
    });
});
//# sourceMappingURL=ecma_quirks_spec.js.map