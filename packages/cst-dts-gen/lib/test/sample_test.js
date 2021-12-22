"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutputFileForSnapshot = exports.testNameFromDir = exports.executeSampleTest = void 0;
var api_1 = require("../src/api");
var chai_1 = require("chai");
var fs_1 = require("fs");
var path_1 = require("path");
function executeSampleTest(dirPath, parser) {
    it("Can generate type definition", function () {
        var result = (0, api_1.generateCstDts)(parser);
        var expectedOutputPath = getOutputFileForSnapshot(dirPath);
        var expectedOutput = (0, fs_1.readFileSync)(expectedOutputPath).toString("utf8");
        var simpleNewLinesOutput = expectedOutput.replace(/\r\n/g, "\n");
        (0, chai_1.expect)(result).to.equal(simpleNewLinesOutput);
    });
}
exports.executeSampleTest = executeSampleTest;
function testNameFromDir(dirPath) {
    return (0, path_1.basename)(dirPath);
}
exports.testNameFromDir = testNameFromDir;
function getOutputFileForSnapshot(libSnapshotDir) {
    var srcSnapshotDir = getSourceFilePath(libSnapshotDir);
    return (0, path_1.resolve)(srcSnapshotDir, "output.d.ts");
}
exports.getOutputFileForSnapshot = getOutputFileForSnapshot;
// paths are for compiled typescript
var packageDir = (0, path_1.resolve)(__dirname, "../..");
var libDir = (0, path_1.resolve)(packageDir, "lib");
function getSourceFilePath(libFilePath) {
    var relativeDirPath = (0, path_1.relative)(libDir, libFilePath);
    return (0, path_1.resolve)(packageDir, relativeDirPath);
}
//# sourceMappingURL=sample_test.js.map