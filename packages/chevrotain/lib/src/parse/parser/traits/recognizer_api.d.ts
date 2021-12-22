import { AtLeastOneSepMethodOpts, ConsumeMethodOpts, DSLMethodOpts, DSLMethodOptsWithErr, GrammarAction, IOrAlt, IRuleConfig, ISerializedGast, IToken, ManySepMethodOpts, OrMethodOpts, SubruleMethodOpts, TokenType } from "@chevrotain/types";
import { MixedInParser } from "./parser_traits";
import { Rule } from "../../grammar/gast/gast_public";
import { ParserMethodInternal } from "../types";
/**
 * This trait is responsible for implementing the public API
 * for defining Chevrotain parsers, i.e:
 * - CONSUME
 * - RULE
 * - OPTION
 * - ...
 */
export declare class RecognizerApi {
    ACTION<T>(this: MixedInParser, impl: () => T): T;
    consume(this: MixedInParser, idx: number, tokType: TokenType, options?: ConsumeMethodOpts): IToken;
    subrule<ARGS extends unknown[], R>(this: MixedInParser, idx: number, ruleToCall: ParserMethodInternal<ARGS, R>, options?: SubruleMethodOpts<ARGS>): R;
    option<OUT>(this: MixedInParser, idx: number, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): OUT | undefined;
    or(this: MixedInParser, idx: number, altsOrOpts: IOrAlt<any>[] | OrMethodOpts<any>): any;
    many(this: MixedInParser, idx: number, actionORMethodDef: GrammarAction<any> | DSLMethodOpts<any>): void;
    atLeastOne(this: MixedInParser, idx: number, actionORMethodDef: GrammarAction<any> | DSLMethodOptsWithErr<any>): void;
    CONSUME(this: MixedInParser, tokType: TokenType, options?: ConsumeMethodOpts): IToken;
    CONSUME1(this: MixedInParser, tokType: TokenType, options?: ConsumeMethodOpts): IToken;
    CONSUME2(this: MixedInParser, tokType: TokenType, options?: ConsumeMethodOpts): IToken;
    CONSUME3(this: MixedInParser, tokType: TokenType, options?: ConsumeMethodOpts): IToken;
    CONSUME4(this: MixedInParser, tokType: TokenType, options?: ConsumeMethodOpts): IToken;
    CONSUME5(this: MixedInParser, tokType: TokenType, options?: ConsumeMethodOpts): IToken;
    CONSUME6(this: MixedInParser, tokType: TokenType, options?: ConsumeMethodOpts): IToken;
    CONSUME7(this: MixedInParser, tokType: TokenType, options?: ConsumeMethodOpts): IToken;
    CONSUME8(this: MixedInParser, tokType: TokenType, options?: ConsumeMethodOpts): IToken;
    CONSUME9(this: MixedInParser, tokType: TokenType, options?: ConsumeMethodOpts): IToken;
    SUBRULE<ARGS extends unknown[], R>(this: MixedInParser, ruleToCall: ParserMethodInternal<ARGS, R>, options?: SubruleMethodOpts<ARGS>): R;
    SUBRULE1<ARGS extends unknown[], R>(this: MixedInParser, ruleToCall: ParserMethodInternal<ARGS, R>, options?: SubruleMethodOpts<ARGS>): R;
    SUBRULE2<ARGS extends unknown[], R>(this: MixedInParser, ruleToCall: ParserMethodInternal<ARGS, R>, options?: SubruleMethodOpts<ARGS>): R;
    SUBRULE3<ARGS extends unknown[], R>(this: MixedInParser, ruleToCall: ParserMethodInternal<ARGS, R>, options?: SubruleMethodOpts<ARGS>): R;
    SUBRULE4<ARGS extends unknown[], R>(this: MixedInParser, ruleToCall: ParserMethodInternal<ARGS, R>, options?: SubruleMethodOpts<ARGS>): R;
    SUBRULE5<ARGS extends unknown[], R>(this: MixedInParser, ruleToCall: ParserMethodInternal<ARGS, R>, options?: SubruleMethodOpts<ARGS>): R;
    SUBRULE6<ARGS extends unknown[], R>(this: MixedInParser, ruleToCall: ParserMethodInternal<ARGS, R>, options?: SubruleMethodOpts<ARGS>): R;
    SUBRULE7<ARGS extends unknown[], R>(this: MixedInParser, ruleToCall: ParserMethodInternal<ARGS, R>, options?: SubruleMethodOpts<ARGS>): R;
    SUBRULE8<ARGS extends unknown[], R>(this: MixedInParser, ruleToCall: ParserMethodInternal<ARGS, R>, options?: SubruleMethodOpts<ARGS>): R;
    SUBRULE9<ARGS extends unknown[], R>(this: MixedInParser, ruleToCall: ParserMethodInternal<ARGS, R>, options?: SubruleMethodOpts<ARGS>): R;
    OPTION<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): OUT | undefined;
    OPTION1<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): OUT | undefined;
    OPTION2<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): OUT | undefined;
    OPTION3<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): OUT | undefined;
    OPTION4<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): OUT | undefined;
    OPTION5<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): OUT | undefined;
    OPTION6<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): OUT | undefined;
    OPTION7<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): OUT | undefined;
    OPTION8<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): OUT | undefined;
    OPTION9<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): OUT | undefined;
    OR<T>(this: MixedInParser, altsOrOpts: IOrAlt<any>[] | OrMethodOpts<unknown>): T;
    OR1<T>(this: MixedInParser, altsOrOpts: IOrAlt<any>[] | OrMethodOpts<unknown>): T;
    OR2<T>(this: MixedInParser, altsOrOpts: IOrAlt<any>[] | OrMethodOpts<unknown>): T;
    OR3<T>(this: MixedInParser, altsOrOpts: IOrAlt<any>[] | OrMethodOpts<unknown>): T;
    OR4<T>(this: MixedInParser, altsOrOpts: IOrAlt<any>[] | OrMethodOpts<unknown>): T;
    OR5<T>(this: MixedInParser, altsOrOpts: IOrAlt<any>[] | OrMethodOpts<unknown>): T;
    OR6<T>(this: MixedInParser, altsOrOpts: IOrAlt<any>[] | OrMethodOpts<unknown>): T;
    OR7<T>(this: MixedInParser, altsOrOpts: IOrAlt<any>[] | OrMethodOpts<unknown>): T;
    OR8<T>(this: MixedInParser, altsOrOpts: IOrAlt<any>[] | OrMethodOpts<unknown>): T;
    OR9<T>(this: MixedInParser, altsOrOpts: IOrAlt<any>[] | OrMethodOpts<unknown>): T;
    MANY<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): void;
    MANY1<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): void;
    MANY2<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): void;
    MANY3<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): void;
    MANY4<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): void;
    MANY5<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): void;
    MANY6<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): void;
    MANY7<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): void;
    MANY8<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): void;
    MANY9<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): void;
    MANY_SEP<OUT>(this: MixedInParser, options: ManySepMethodOpts<OUT>): void;
    MANY_SEP1<OUT>(this: MixedInParser, options: ManySepMethodOpts<OUT>): void;
    MANY_SEP2<OUT>(this: MixedInParser, options: ManySepMethodOpts<OUT>): void;
    MANY_SEP3<OUT>(this: MixedInParser, options: ManySepMethodOpts<OUT>): void;
    MANY_SEP4<OUT>(this: MixedInParser, options: ManySepMethodOpts<OUT>): void;
    MANY_SEP5<OUT>(this: MixedInParser, options: ManySepMethodOpts<OUT>): void;
    MANY_SEP6<OUT>(this: MixedInParser, options: ManySepMethodOpts<OUT>): void;
    MANY_SEP7<OUT>(this: MixedInParser, options: ManySepMethodOpts<OUT>): void;
    MANY_SEP8<OUT>(this: MixedInParser, options: ManySepMethodOpts<OUT>): void;
    MANY_SEP9<OUT>(this: MixedInParser, options: ManySepMethodOpts<OUT>): void;
    AT_LEAST_ONE<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>): void;
    AT_LEAST_ONE1<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>): void;
    AT_LEAST_ONE2<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>): void;
    AT_LEAST_ONE3<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>): void;
    AT_LEAST_ONE4<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>): void;
    AT_LEAST_ONE5<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>): void;
    AT_LEAST_ONE6<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>): void;
    AT_LEAST_ONE7<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>): void;
    AT_LEAST_ONE8<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>): void;
    AT_LEAST_ONE9<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>): void;
    AT_LEAST_ONE_SEP<OUT>(this: MixedInParser, options: AtLeastOneSepMethodOpts<OUT>): void;
    AT_LEAST_ONE_SEP1<OUT>(this: MixedInParser, options: AtLeastOneSepMethodOpts<OUT>): void;
    AT_LEAST_ONE_SEP2<OUT>(this: MixedInParser, options: AtLeastOneSepMethodOpts<OUT>): void;
    AT_LEAST_ONE_SEP3<OUT>(this: MixedInParser, options: AtLeastOneSepMethodOpts<OUT>): void;
    AT_LEAST_ONE_SEP4<OUT>(this: MixedInParser, options: AtLeastOneSepMethodOpts<OUT>): void;
    AT_LEAST_ONE_SEP5<OUT>(this: MixedInParser, options: AtLeastOneSepMethodOpts<OUT>): void;
    AT_LEAST_ONE_SEP6<OUT>(this: MixedInParser, options: AtLeastOneSepMethodOpts<OUT>): void;
    AT_LEAST_ONE_SEP7<OUT>(this: MixedInParser, options: AtLeastOneSepMethodOpts<OUT>): void;
    AT_LEAST_ONE_SEP8<OUT>(this: MixedInParser, options: AtLeastOneSepMethodOpts<OUT>): void;
    AT_LEAST_ONE_SEP9<OUT>(this: MixedInParser, options: AtLeastOneSepMethodOpts<OUT>): void;
    RULE<T>(this: MixedInParser, name: string, implementation: (...implArgs: any[]) => T, config?: IRuleConfig<T>): (idxInCallingRule?: number, ...args: any[]) => T | any;
    OVERRIDE_RULE<T>(this: MixedInParser, name: string, impl: (...implArgs: any[]) => T, config?: IRuleConfig<T>): (idxInCallingRule?: number, ...args: any[]) => T;
    BACKTRACK<T>(this: MixedInParser, grammarRule: (...args: any[]) => T, args?: any[]): () => boolean;
    getGAstProductions(this: MixedInParser): Record<string, Rule>;
    getSerializedGastProductions(this: MixedInParser): ISerializedGast[];
}
