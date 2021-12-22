import { CstNode, IParserConfig, IRecognitionException, IRuleConfig, IToken, TokenType, TokenVocabulary } from "@chevrotain/types";
import { MixedInParser } from "./traits/parser_traits";
import { IParserDefinitionError } from "../grammar/types";
import { IParserConfigInternal } from "./types";
export declare const END_OF_FILE: IToken;
export declare type TokenMatcher = (token: IToken, tokType: TokenType) => boolean;
export declare type LookAheadSequence = TokenType[][];
export declare const DEFAULT_PARSER_CONFIG: Required<IParserConfigInternal>;
export declare const DEFAULT_RULE_CONFIG: Required<IRuleConfig<any>>;
export declare enum ParserDefinitionErrorType {
    INVALID_RULE_NAME = 0,
    DUPLICATE_RULE_NAME = 1,
    INVALID_RULE_OVERRIDE = 2,
    DUPLICATE_PRODUCTIONS = 3,
    UNRESOLVED_SUBRULE_REF = 4,
    LEFT_RECURSION = 5,
    NONE_LAST_EMPTY_ALT = 6,
    AMBIGUOUS_ALTS = 7,
    CONFLICT_TOKENS_RULES_NAMESPACE = 8,
    INVALID_TOKEN_NAME = 9,
    NO_NON_EMPTY_LOOKAHEAD = 10,
    AMBIGUOUS_PREFIX_ALTS = 11,
    TOO_MANY_ALTS = 12
}
export interface IParserDuplicatesDefinitionError extends IParserDefinitionError {
    dslName: string;
    occurrence: number;
    parameter?: string;
}
export interface IParserEmptyAlternativeDefinitionError extends IParserDefinitionError {
    occurrence: number;
    alternative: number;
}
export interface IParserAmbiguousAlternativesDefinitionError extends IParserDefinitionError {
    occurrence: number | string;
    alternatives: number[];
}
export interface IParserUnresolvedRefDefinitionError extends IParserDefinitionError {
    unresolvedRefName: string;
}
export interface IParserState {
    errors: IRecognitionException[];
    lexerState: any;
    RULE_STACK: number[];
    CST_STACK: CstNode[];
}
export declare type Predicate = () => boolean;
export declare function EMPTY_ALT(): () => undefined;
export declare function EMPTY_ALT<T>(value: T): () => T;
export declare class Parser {
    static DEFER_DEFINITION_ERRORS_HANDLING: boolean;
    /**
     *  @deprecated use the **instance** method with the same name instead
     */
    static performSelfAnalysis(parserInstance: Parser): void;
    performSelfAnalysis(this: MixedInParser): void;
    definitionErrors: IParserDefinitionError[];
    selfAnalysisDone: boolean;
    protected skipValidations: boolean;
    constructor(tokenVocabulary: TokenVocabulary, config: IParserConfig);
}
export declare class CstParser extends Parser {
    constructor(tokenVocabulary: TokenVocabulary, config?: IParserConfigInternal);
}
export declare class EmbeddedActionsParser extends Parser {
    constructor(tokenVocabulary: TokenVocabulary, config?: IParserConfigInternal);
}
