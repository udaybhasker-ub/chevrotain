"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PT = exports.ParseTree = void 0;
var compact_1 = __importDefault(require("lodash/compact"));
var isFunction_1 = __importDefault(require("lodash/isFunction"));
var isUndefined_1 = __importDefault(require("lodash/isUndefined"));
var ParseTree = /** @class */ (function () {
    function ParseTree(payload, children) {
        if (children === void 0) { children = []; }
        this.payload = payload;
        this.children = children;
    }
    ParseTree.prototype.getImage = function () {
        return this.payload.image;
    };
    ParseTree.prototype.getLine = function () {
        return this.payload.startLine;
    };
    ParseTree.prototype.getColumn = function () {
        return this.payload.startColumn;
    };
    return ParseTree;
}());
exports.ParseTree = ParseTree;
/**
 * convenience factory for ParseTrees
 *
 * @param {TokenType|Token} tokenOrTokenClass The Token instance to be used as the root node, or a constructor Function
 *                         that will create the root node.
 * @param {ParseTree[]} children The sub nodes of the ParseTree to the built
 * @returns {ParseTree}
 */
function PT(tokenOrTokenClass, children) {
    if (children === void 0) { children = []; }
    var childrenCompact = (0, compact_1.default)(children);
    if (tokenOrTokenClass.image !== undefined) {
        return new ParseTree(tokenOrTokenClass, childrenCompact);
    }
    else if ((0, isFunction_1.default)(tokenOrTokenClass)) {
        return new ParseTree(new tokenOrTokenClass(), childrenCompact);
    }
    else if ((0, isUndefined_1.default)(tokenOrTokenClass) || tokenOrTokenClass === null) {
        return null;
    }
    else {
        throw "Invalid parameter ".concat(tokenOrTokenClass, " to PT factory.");
    }
}
exports.PT = PT;
//# sourceMappingURL=parse_tree.js.map