import { AtLeastOneSepMethodOpts, ConsumeMethodOpts, DSLMethodOpts, DSLMethodOptsWithErr, GrammarAction, IOrAlt, IParserConfig, IRuleConfig, IToken, ManySepMethodOpts, OrMethodOpts, SubruleMethodOpts, TokenType, TokenVocabulary } from "@chevrotain/types";
import { AbstractNextTerminalAfterProductionWalker } from "../../grammar/interpreter";
import { IParserState, TokenMatcher } from "../parser";
import { MixedInParser } from "./parser_traits";
import { Rule } from "../../grammar/gast/gast_public";
import { ParserMethodInternal } from "../types";
/**
 * This trait is responsible for the runtime parsing engine
 * Used by the official API (recognizer_api.ts)
 */
export declare class RecognizerEngine {
    isBackTrackingStack: boolean[];
    className: string;
    RULE_STACK: number[];
    RULE_OCCURRENCE_STACK: number[];
    definedRulesNames: string[];
    tokensMap: {
        [fqn: string]: TokenType;
    };
    gastProductionsCache: Record<string, Rule>;
    shortRuleNameToFull: Record<string, string>;
    fullRuleNameToShort: Record<string, number>;
    ruleShortNameIdx: number;
    tokenMatcher: TokenMatcher;
    subruleIdx: number;
    initRecognizerEngine(tokenVocabulary: TokenVocabulary, config: IParserConfig): void;
    defineRule<ARGS extends unknown[], R>(this: MixedInParser, ruleName: string, impl: (...args: ARGS) => R, config: IRuleConfig<R>): ParserMethodInternal<ARGS, R>;
    invokeRuleCatch(this: MixedInParser, e: Error, resyncEnabledConfig: boolean, recoveryValueFunc: Function): unknown;
    optionInternal<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>, occurrence: number): OUT | undefined;
    optionInternalLogic<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>, occurrence: number, key: number): OUT | undefined;
    atLeastOneInternal<OUT>(this: MixedInParser, prodOccurrence: number, actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>): void;
    atLeastOneInternalLogic<OUT>(this: MixedInParser, prodOccurrence: number, actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>, key: number): void;
    atLeastOneSepFirstInternal<OUT>(this: MixedInParser, prodOccurrence: number, options: AtLeastOneSepMethodOpts<OUT>): void;
    atLeastOneSepFirstInternalLogic<OUT>(this: MixedInParser, prodOccurrence: number, options: AtLeastOneSepMethodOpts<OUT>, key: number): void;
    manyInternal<OUT>(this: MixedInParser, prodOccurrence: number, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): void;
    manyInternalLogic<OUT>(this: MixedInParser, prodOccurrence: number, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>, key: number): void;
    manySepFirstInternal<OUT>(this: MixedInParser, prodOccurrence: number, options: ManySepMethodOpts<OUT>): void;
    manySepFirstInternalLogic<OUT>(this: MixedInParser, prodOccurrence: number, options: ManySepMethodOpts<OUT>, key: number): void;
    repetitionSepSecondInternal<OUT>(this: MixedInParser, prodOccurrence: number, separator: TokenType, separatorLookAheadFunc: () => boolean, action: GrammarAction<OUT>, nextTerminalAfterWalker: typeof AbstractNextTerminalAfterProductionWalker): void;
    doSingleRepetition(this: MixedInParser, action: Function): any;
    orInternal<T>(this: MixedInParser, altsOrOpts: IOrAlt<any>[] | OrMethodOpts<unknown>, occurrence: number): T;
    ruleFinallyStateUpdate(this: MixedInParser): void;
    subruleInternal<ARGS extends unknown[], R>(this: MixedInParser, ruleToCall: ParserMethodInternal<ARGS, R>, idx: number, options?: SubruleMethodOpts<ARGS>): R;
    subruleInternalError(this: MixedInParser, e: any, options: SubruleMethodOpts<unknown[]> | undefined, ruleName: string): void;
    consumeInternal(this: MixedInParser, tokType: TokenType, idx: number, options: ConsumeMethodOpts | undefined): IToken;
    consumeInternalError(this: MixedInParser, tokType: TokenType, nextToken: IToken, options: ConsumeMethodOpts | undefined): void;
    consumeInternalRecovery(this: MixedInParser, tokType: TokenType, idx: number, eFromConsumption: Error): IToken;
    saveRecogState(this: MixedInParser): IParserState;
    reloadRecogState(this: MixedInParser, newState: IParserState): void;
    ruleInvocationStateUpdate(this: MixedInParser, shortName: number, fullName: string, idxInCallingRule: number): void;
    isBackTracking(this: MixedInParser): boolean;
    getCurrRuleFullName(this: MixedInParser): string;
    shortRuleNameToFullName(this: MixedInParser, shortName: number): string;
    isAtEndOfInput(this: MixedInParser): boolean;
    reset(this: MixedInParser): void;
}
