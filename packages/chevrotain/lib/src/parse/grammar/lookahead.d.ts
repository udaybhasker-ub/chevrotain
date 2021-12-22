import { TokenMatcher, LookAheadSequence } from "../parser/parser";
import { Alternation, Rule } from "./gast/gast_public";
import { IOrAlt, IProduction, TokenType } from "@chevrotain/types";
export declare enum PROD_TYPE {
    OPTION = 0,
    REPETITION = 1,
    REPETITION_MANDATORY = 2,
    REPETITION_MANDATORY_WITH_SEPARATOR = 3,
    REPETITION_WITH_SEPARATOR = 4,
    ALTERNATION = 5
}
export declare function getProdType(prod: IProduction): PROD_TYPE;
export declare function buildLookaheadFuncForOr(occurrence: number, ruleGrammar: Rule, maxLookahead: number, hasPredicates: boolean, dynamicTokensEnabled: boolean, laFuncBuilder: Function): (orAlts?: IOrAlt<any>[]) => number;
/**
 *  When dealing with an Optional production (OPTION/MANY/2nd iteration of AT_LEAST_ONE/...) we need to compare
 *  the lookahead "inside" the production and the lookahead immediately "after" it in the same top level rule (context free).
 *
 *  Example: given a production:
 *  ABC(DE)?DF
 *
 *  The optional '(DE)?' should only be entered if we see 'DE'. a single Token 'D' is not sufficient to distinguish between the two
 *  alternatives.
 *
 *  @returns A Lookahead function which will return true IFF the parser should parse the Optional production.
 */
export declare function buildLookaheadFuncForOptionalProd(occurrence: number, ruleGrammar: Rule, k: number, dynamicTokensEnabled: boolean, prodType: PROD_TYPE, lookaheadBuilder: (lookAheadSequence: LookAheadSequence, tokenMatcher: TokenMatcher, dynamicTokensEnabled: boolean) => () => boolean): () => boolean;
export declare type Alternative = TokenType[][];
export declare function buildAlternativesLookAheadFunc(alts: LookAheadSequence[], hasPredicates: boolean, tokenMatcher: TokenMatcher, dynamicTokensEnabled: boolean): (orAlts: IOrAlt<any>[]) => number | undefined;
export declare function buildSingleAlternativeLookaheadFunction(alt: LookAheadSequence, tokenMatcher: TokenMatcher, dynamicTokensEnabled: boolean): () => boolean;
export declare function lookAheadSequenceFromAlternatives(altsDefs: IProduction[], k: number): LookAheadSequence[];
export declare function getLookaheadPathsForOr(occurrence: number, ruleGrammar: Rule, k: number, orProd?: Alternation): LookAheadSequence[];
export declare function getLookaheadPathsForOptionalProd(occurrence: number, ruleGrammar: Rule, prodType: PROD_TYPE, k: number): LookAheadSequence[];
export declare function containsPath(alternative: Alternative, searchPath: TokenType[]): boolean;
export declare function isStrictPrefixOfPath(prefix: TokenType[], other: TokenType[]): boolean;
export declare function areTokenCategoriesNotUsed(lookAheadPaths: LookAheadSequence[]): boolean;
