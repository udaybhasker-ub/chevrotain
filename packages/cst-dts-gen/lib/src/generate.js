"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genDts = void 0;
var flatten_1 = __importDefault(require("lodash/flatten"));
var map_1 = __importDefault(require("lodash/map"));
var upperFirst_1 = __importDefault(require("lodash/upperFirst"));
function genDts(model, options) {
    var contentParts = [];
    if (options.includeTypes || options.includeVisitorInterface) {
        contentParts = contentParts.concat("import type { CstNode, ICstVisitor, IToken } from \"chevrotain\";");
    }
    if (options.includeTypes) {
        contentParts = contentParts.concat((0, flatten_1.default)((0, map_1.default)(model, function (node) { return genCstNodeTypes(node); })));
    }
    if (options.includeVisitorInterface) {
        contentParts = contentParts.concat(genVisitor(options.visitorInterfaceName, model));
    }
    return contentParts.length ? contentParts.join("\n\n") + "\n" : "";
}
exports.genDts = genDts;
function genCstNodeTypes(node) {
    var nodeCstInterface = genNodeInterface(node);
    var nodeChildrenInterface = genNodeChildrenType(node);
    return [nodeCstInterface, nodeChildrenInterface];
}
function genNodeInterface(node) {
    var nodeInterfaceName = getNodeInterfaceName(node.name);
    var childrenTypeName = getNodeChildrenTypeName(node.name);
    return "export interface " + nodeInterfaceName + " extends CstNode {\n  name: \"" + node.name + "\";\n  children: " + childrenTypeName + ";\n}";
}
function genNodeChildrenType(node) {
    var typeName = getNodeChildrenTypeName(node.name);
    return "export type " + typeName + " = {\n  " + (0, map_1.default)(node.properties, function (property) { return genChildProperty(property); }).join("\n  ") + "\n};";
}
function genChildProperty(prop) {
    var typeName = getTypeString(prop.type);
    return "" + prop.name + (prop.optional ? "?" : "") + ": " + typeName + "[];";
}
function genVisitor(name, nodes) {
    return "export interface " + name + "<IN, OUT> extends ICstVisitor<IN, OUT> {\n  " + (0, map_1.default)(nodes, function (node) { return genVisitorFunction(node); }).join("\n  ") + "\n}";
}
function genVisitorFunction(node) {
    var childrenTypeName = getNodeChildrenTypeName(node.name);
    return node.name + "(children: " + childrenTypeName + ", param?: IN): OUT;";
}
function getTypeString(type) {
    if (type.kind === "token") {
        return "IToken";
    }
    return getNodeInterfaceName(type.name);
}
function getNodeInterfaceName(ruleName) {
    return (0, upperFirst_1.default)(ruleName) + "CstNode";
}
function getNodeChildrenTypeName(ruleName) {
    return (0, upperFirst_1.default)(ruleName) + "CstChildren";
}
//# sourceMappingURL=generate.js.map