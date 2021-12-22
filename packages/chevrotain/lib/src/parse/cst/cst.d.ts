import { CstNode, CstNodeLocation, IToken } from "@chevrotain/types";
/**
 * This nodeLocation tracking is not efficient and should only be used
 * when error recovery is enabled or the Token Vector contains virtual Tokens
 * (e.g, Python Indent/Outdent)
 * As it executes the calculation for every single terminal/nonTerminal
 * and does not rely on the fact the token vector is **sorted**
 */
export declare function setNodeLocationOnlyOffset(currNodeLocation: CstNodeLocation, newLocationInfo: Required<Pick<IToken, "startOffset" | "endOffset">>): void;
/**
 * This nodeLocation tracking is not efficient and should only be used
 * when error recovery is enabled or the Token Vector contains virtual Tokens
 * (e.g, Python Indent/Outdent)
 * As it executes the calculation for every single terminal/nonTerminal
 * and does not rely on the fact the token vector is **sorted**
 */
export declare function setNodeLocationFull(currNodeLocation: CstNodeLocation, newLocationInfo: CstNodeLocation): void;
export declare function addTerminalToCst(node: CstNode, token: IToken, tokenTypeName: string): void;
export declare function addNoneTerminalToCst(node: CstNode, ruleName: string, ruleResult: any): void;
