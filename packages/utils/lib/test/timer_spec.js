"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("../src/api");
var chai_1 = require("chai");
describe("The timer helper", function () {
    it("will return the total execution time of a sync function", function () {
        var time = (0, api_1.timer)(function () {
            var sab = new SharedArrayBuffer(1024);
            var int32 = new Int32Array(sab);
            Atomics.wait(int32, 0, 0, 100);
        }).time;
        (0, chai_1.expect)(time).to.be.greaterThanOrEqual(100);
    });
    it("will return the value of the callback function", function () {
        var value = (0, api_1.timer)(function () {
            return 2 * 2;
        }).value;
        (0, chai_1.expect)(value).to.eql(4);
    });
});
//# sourceMappingURL=timer_spec.js.map