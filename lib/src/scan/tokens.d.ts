import { IToken, TokenType } from "@chevrotain/types";
export declare function tokenStructuredMatcher(tokInstance: IToken, tokConstructor: TokenType): boolean;
export declare function tokenStructuredMatcherNoCategories(token: IToken, tokType: TokenType): boolean;
export declare let tokenShortNameIdx: number;
export declare const tokenIdxToClass: {
    [tokenIdx: number]: TokenType;
};
export declare function augmentTokenTypes(tokenTypes: TokenType[]): void;
export declare function expandCategories(tokenTypes: TokenType[]): TokenType[];
export declare function assignTokenDefaultProps(tokenTypes: TokenType[]): void;
export declare function assignCategoriesTokensProp(tokenTypes: TokenType[]): void;
export declare function assignCategoriesMapProp(tokenTypes: TokenType[]): void;
export declare function singleAssignCategoriesToksMap(path: TokenType[], nextNode: TokenType): void;
export declare function hasShortKeyProperty(tokType: TokenType): boolean;
export declare function hasCategoriesProperty(tokType: TokenType): boolean;
export declare function hasExtendingTokensTypesProperty(tokType: TokenType): boolean;
export declare function hasExtendingTokensTypesMapProperty(tokType: TokenType): boolean;
export declare function isTokenType(tokType: TokenType): boolean;
