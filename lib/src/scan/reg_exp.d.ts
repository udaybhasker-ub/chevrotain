import { ASTNode } from "./reg_exp_parser";
export declare const failedOptimizationPrefixMsg = "Unable to use \"first char\" lexer optimizations:\n";
export declare function getOptimizedStartCodesIndices(regExp: RegExp, ensureOptimizations?: boolean): number[];
export declare function firstCharOptimizedIndices(ast: ASTNode, result: {
    [charCode: number]: number;
}, ignoreCase: boolean): number[];
export declare function canMatchCharCode(charCodes: number[], pattern: RegExp | string): boolean;
