import { AtLeastOneSepMethodOpts, ConsumeMethodOpts, CstNode, DSLMethodOpts, DSLMethodOptsWithErr, GrammarAction, IOrAlt, IParserConfig, IProduction, IToken, ManySepMethodOpts, OrMethodOpts, SubruleMethodOpts, TokenType } from "@chevrotain/types";
import { MixedInParser } from "./parser_traits";
import { Rule } from "../../grammar/gast/gast_public";
import { ParserMethodInternal } from "../types";
declare type ProdWithDef = IProduction & {
    definition?: IProduction[];
};
/**
 * This trait handles the creation of the GAST structure for Chevrotain Grammars
 */
export declare class GastRecorder {
    recordingProdStack: ProdWithDef[];
    RECORDING_PHASE: boolean;
    initGastRecorder(this: MixedInParser, config: IParserConfig): void;
    enableRecording(this: MixedInParser): void;
    disableRecording(this: MixedInParser): void;
    ACTION_RECORD<T>(this: MixedInParser, impl: () => T): T;
    BACKTRACK_RECORD<T>(grammarRule: (...args: any[]) => T, args?: any[]): () => boolean;
    LA_RECORD(howMuch: number): IToken;
    topLevelRuleRecord(name: string, def: Function): Rule;
    optionInternalRecord<OUT>(this: MixedInParser, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>, occurrence: number): OUT;
    atLeastOneInternalRecord<OUT>(this: MixedInParser, occurrence: number, actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>): void;
    atLeastOneSepFirstInternalRecord<OUT>(this: MixedInParser, occurrence: number, options: AtLeastOneSepMethodOpts<OUT>): void;
    manyInternalRecord<OUT>(this: MixedInParser, occurrence: number, actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>): void;
    manySepFirstInternalRecord<OUT>(this: MixedInParser, occurrence: number, options: ManySepMethodOpts<OUT>): void;
    orInternalRecord<T>(this: MixedInParser, altsOrOpts: IOrAlt<any>[] | OrMethodOpts<unknown>, occurrence: number): T;
    subruleInternalRecord<ARGS extends unknown[], R>(this: MixedInParser, ruleToCall: ParserMethodInternal<ARGS, R>, occurrence: number, options?: SubruleMethodOpts<ARGS>): R | CstNode;
    consumeInternalRecord(this: MixedInParser, tokType: TokenType, occurrence: number, options?: ConsumeMethodOpts): IToken;
}
export {};
