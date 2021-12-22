import { IToken, ITokenConfig, TokenType } from "@chevrotain/types";
export declare function tokenLabel(tokType: TokenType): string;
export declare function tokenName(tokType: TokenType): string;
export declare function hasTokenLabel(obj: TokenType): obj is TokenType & Pick<Required<TokenType>, "LABEL">;
export declare function createToken(config: ITokenConfig): TokenType;
export declare const EOF: TokenType;
export declare function createTokenInstance(tokType: TokenType, image: string, startOffset: number, endOffset: number, startLine: number, endLine: number, startColumn: number, endColumn: number): IToken;
export declare function tokenMatcher(token: IToken, tokType: TokenType): boolean;
