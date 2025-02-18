import { IRegExpExec, LexerDefinitionErrorType } from "./lexer_public";
import { ILexerDefinitionError, ILineTerminatorsTester, IMultiModeLexerDefinition, IToken, TokenType } from "@chevrotain/types";
export declare const DEFAULT_MODE = "defaultMode";
export declare const MODES = "modes";
export interface IPatternConfig {
    pattern: IRegExpExec | string;
    longerAlt: number[] | undefined;
    canLineTerminator: boolean;
    isCustom: boolean;
    short: number | false;
    group: string | undefined | false;
    push: string | undefined;
    pop: boolean;
    tokenType: TokenType;
    tokenTypeIdx: number;
}
export interface IAnalyzeResult {
    patternIdxToConfig: IPatternConfig[];
    charCodeToPatternIdxToConfig: {
        [charCode: number]: IPatternConfig[];
    };
    emptyGroups: {
        [groupName: string]: IToken[];
    };
    hasCustom: boolean;
    canBeOptimized: boolean;
}
export declare let SUPPORT_STICKY: boolean;
export declare function disableSticky(): void;
export declare function enableSticky(): void;
export declare function analyzeTokenTypes(tokenTypes: TokenType[], options: {
    positionTracking?: "full" | "onlyStart" | "onlyOffset";
    ensureOptimizations?: boolean;
    lineTerminatorCharacters?: (number | string)[];
    useSticky?: boolean;
    safeMode?: boolean;
    tracer?: (msg: string, action: () => void) => void;
}): IAnalyzeResult;
export declare function validatePatterns(tokenTypes: TokenType[], validModesNames: string[]): ILexerDefinitionError[];
export interface ILexerFilterResult {
    errors: ILexerDefinitionError[];
    valid: TokenType[];
}
export declare function findMissingPatterns(tokenTypes: TokenType[]): ILexerFilterResult;
export declare function findInvalidPatterns(tokenTypes: TokenType[]): ILexerFilterResult;
export declare function findEndOfInputAnchor(tokenTypes: TokenType[]): ILexerDefinitionError[];
export declare function findEmptyMatchRegExps(tokenTypes: TokenType[]): ILexerDefinitionError[];
export declare function findStartOfInputAnchor(tokenTypes: TokenType[]): ILexerDefinitionError[];
export declare function findUnsupportedFlags(tokenTypes: TokenType[]): ILexerDefinitionError[];
export declare function findDuplicatePatterns(tokenTypes: TokenType[]): ILexerDefinitionError[];
export declare function findInvalidGroupType(tokenTypes: TokenType[]): ILexerDefinitionError[];
export declare function findModesThatDoNotExist(tokenTypes: TokenType[], validModes: string[]): ILexerDefinitionError[];
export declare function findUnreachablePatterns(tokenTypes: TokenType[]): ILexerDefinitionError[];
export declare function addStartOfInput(pattern: RegExp): RegExp;
export declare function addStickyFlag(pattern: RegExp): RegExp;
export declare function performRuntimeChecks(lexerDefinition: IMultiModeLexerDefinition, trackLines: boolean, lineTerminatorCharacters: (number | string)[]): ILexerDefinitionError[];
export declare function performWarningRuntimeChecks(lexerDefinition: IMultiModeLexerDefinition, trackLines: boolean, lineTerminatorCharacters: (number | string)[]): ILexerDefinitionError[];
export declare function cloneEmptyGroups(emptyGroups: {
    [groupName: string]: IToken;
}): {
    [groupName: string]: IToken;
};
export declare function isCustomPattern(tokenType: TokenType): boolean;
export declare function isShortPattern(pattern: any): number | false;
/**
 * Faster than using a RegExp for default newline detection during lexing.
 */
export declare const LineTerminatorOptimizedTester: ILineTerminatorsTester;
export declare function buildLineBreakIssueMessage(tokType: TokenType, details: {
    issue: LexerDefinitionErrorType.IDENTIFY_TERMINATOR | LexerDefinitionErrorType.CUSTOM_LINE_BREAK;
    errMsg?: string;
}): string;
export declare const minOptimizationVal = 256;
export declare function charCodeToOptimizedIndex(charCode: number): number;
