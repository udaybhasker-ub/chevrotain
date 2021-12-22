import { IToken, TokenType } from "@chevrotain/types";
export declare class ParseTree {
    payload: IToken;
    children: ParseTree[];
    getImage(): string;
    getLine(): number | undefined;
    getColumn(): number | undefined;
    constructor(payload: IToken, children?: ParseTree[]);
}
/**
 * convenience factory for ParseTrees
 *
 * @param {TokenType|Token} tokenOrTokenClass The Token instance to be used as the root node, or a constructor Function
 *                         that will create the root node.
 * @param {ParseTree[]} children The sub nodes of the ParseTree to the built
 * @returns {ParseTree}
 */
export declare function PT(tokenOrTokenClass: TokenType | IToken, children?: ParseTree[]): ParseTree | null;
