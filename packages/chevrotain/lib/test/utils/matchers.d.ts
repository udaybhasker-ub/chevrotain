import { IToken, TokenType } from "@chevrotain/types";
export declare function setEquality(actual: any[], expected: any[]): void;
export declare function createRegularToken(tokType: TokenType, image?: string, startOffset?: number, startLine?: number, startColumn?: number, endOffset?: number, endLine?: number, endColumn?: number): IToken;
