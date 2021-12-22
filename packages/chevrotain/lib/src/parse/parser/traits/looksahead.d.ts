import { PROD_TYPE } from "../../grammar/lookahead";
import { LookAheadSequence, TokenMatcher } from "../parser";
import { IOrAlt, IParserConfig } from "@chevrotain/types";
import { MixedInParser } from "./parser_traits";
import { Rule } from "../../grammar/gast/gast_public";
/**
 * Trait responsible for the lookahead related utilities and optimizations.
 */
export declare class LooksAhead {
    maxLookahead: number;
    lookAheadFuncsCache: any;
    dynamicTokensEnabled: boolean;
    initLooksAhead(config: IParserConfig): void;
    preComputeLookaheadFunctions(this: MixedInParser, rules: Rule[]): void;
    computeLookaheadFunc(this: MixedInParser, rule: Rule, prodOccurrence: number, prodKey: number, prodType: PROD_TYPE, prodMaxLookahead: number | undefined, dslMethodName: string): void;
    lookAheadBuilderForOptional(this: MixedInParser, alt: LookAheadSequence, tokenMatcher: TokenMatcher, dynamicTokensEnabled: boolean): () => boolean;
    lookAheadBuilderForAlternatives(this: MixedInParser, alts: LookAheadSequence[], hasPredicates: boolean, tokenMatcher: TokenMatcher, dynamicTokensEnabled: boolean): (orAlts: IOrAlt<any>[]) => number | undefined;
    getKeyForAutomaticLookahead(this: MixedInParser, dslMethodIdx: number, occurrence: number): number;
    getLaFuncFromCache(this: MixedInParser, key: number): Function;
    setLaFuncCache(this: MixedInParser, key: number, value: Function): void;
}
