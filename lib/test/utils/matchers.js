"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegularToken = exports.setEquality = void 0;
var chai_1 = require("chai");
function setEquality(actual, expected) {
    (0, chai_1.expect)(actual).to.deep.include.members(expected);
    (0, chai_1.expect)(expected).to.deep.include.members(actual);
    (0, chai_1.expect)(expected).to.have.lengthOf(actual.length);
}
exports.setEquality = setEquality;
function createRegularToken(tokType, image, startOffset, startLine, startColumn, endOffset, endLine, endColumn) {
    if (image === void 0) { image = ""; }
    if (startOffset === void 0) { startOffset = 1; }
    return {
        image: image,
        startOffset: startOffset,
        startLine: startLine,
        startColumn: startColumn,
        endOffset: endOffset,
        endLine: endLine,
        endColumn: endColumn,
        tokenTypeIdx: tokType.tokenTypeIdx,
        tokenType: tokType
    };
}
exports.createRegularToken = createRegularToken;
//# sourceMappingURL=matchers.js.map