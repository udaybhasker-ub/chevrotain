import { AbstractNextTerminalAfterProductionWalker, IFirstAfterRepetition } from "../../grammar/interpreter";
import { IParserConfig, IToken, ITokenGrammarPath, TokenType } from "@chevrotain/types";
import { MixedInParser } from "./parser_traits";
export declare const EOF_FOLLOW_KEY: any;
export interface IFollowKey {
    ruleName: string;
    idxInCallingRule: number;
    inRule: string;
}
export declare const IN_RULE_RECOVERY_EXCEPTION = "InRuleRecoveryException";
export declare class InRuleRecoveryException extends Error {
    constructor(message: string);
}
/**
 * This trait is responsible for the error recovery and fault tolerant logic
 */
export declare class Recoverable {
    recoveryEnabled: boolean;
    firstAfterRepMap: Record<string, IFirstAfterRepetition>;
    resyncFollows: Record<string, TokenType[]>;
    initRecoverable(config: IParserConfig): void;
    getTokenToInsert(tokType: TokenType): IToken;
    canTokenTypeBeInsertedInRecovery(tokType: TokenType): boolean;
    tryInRepetitionRecovery(this: MixedInParser, grammarRule: Function, grammarRuleArgs: any[], lookAheadFunc: () => boolean, expectedTokType: TokenType): void;
    shouldInRepetitionRecoveryBeTried(this: MixedInParser, expectTokAfterLastMatch: TokenType, nextTokIdx: number, notStuck: boolean | undefined): boolean;
    getFollowsForInRuleRecovery(this: MixedInParser, tokType: TokenType, tokIdxInRule: number): TokenType[];
    tryInRuleRecovery(this: MixedInParser, expectedTokType: TokenType, follows: TokenType[]): IToken;
    canPerformInRuleRecovery(this: MixedInParser, expectedToken: TokenType, follows: TokenType[]): boolean;
    canRecoverWithSingleTokenInsertion(this: MixedInParser, expectedTokType: TokenType, follows: TokenType[]): boolean;
    canRecoverWithSingleTokenDeletion(this: MixedInParser, expectedTokType: TokenType): boolean;
    isInCurrentRuleReSyncSet(this: MixedInParser, tokenTypeIdx: TokenType): boolean;
    findReSyncTokenType(this: MixedInParser): TokenType;
    getCurrFollowKey(this: MixedInParser): IFollowKey;
    buildFullFollowKeyStack(this: MixedInParser): IFollowKey[];
    flattenFollowSet(this: MixedInParser): TokenType[];
    getFollowSetFromFollowKey(this: MixedInParser, followKey: IFollowKey): TokenType[];
    addToResyncTokens(this: MixedInParser, token: IToken, resyncTokens: IToken[]): IToken[];
    reSyncTo(this: MixedInParser, tokType: TokenType): IToken[];
    attemptInRepetitionRecovery(this: MixedInParser, prodFunc: Function, args: any[], lookaheadFunc: () => boolean, dslMethodIdx: number, prodOccurrence: number, nextToksWalker: typeof AbstractNextTerminalAfterProductionWalker, notStuck?: boolean): void;
    getCurrentGrammarPath(this: MixedInParser, tokType: TokenType, tokIdxInRule: number): ITokenGrammarPath;
    getHumanReadableRuleStack(this: MixedInParser): string[];
}
export declare function attemptInRepetitionRecovery(this: MixedInParser, prodFunc: Function, args: any[], lookaheadFunc: () => boolean, dslMethodIdx: number, prodOccurrence: number, nextToksWalker: typeof AbstractNextTerminalAfterProductionWalker, notStuck?: boolean): void;
