/**
 * Helper common type definitions
 * Particularly useful when expending the public API
 * to include additional **internal** properties.
 */
import { IParserConfig, ParserMethod } from "@chevrotain/types";
export declare type ParserMethodInternal<ARGS extends unknown[], R> = ParserMethod<ARGS, R> & {
    ruleName: string;
    originalGrammarAction: Function;
};
export declare type IParserConfigInternal = IParserConfig & {
    outputCst: boolean;
};
