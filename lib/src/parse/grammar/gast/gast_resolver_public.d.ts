import { Rule } from "./gast_public";
import { TokenType } from "@chevrotain/types";
import { IGrammarResolverErrorMessageProvider, IGrammarValidatorErrorMessageProvider, IParserDefinitionError } from "../types";
declare type ResolveGrammarOpts = {
    rules: Rule[];
    errMsgProvider?: IGrammarResolverErrorMessageProvider;
};
export declare function resolveGrammar(options: ResolveGrammarOpts): IParserDefinitionError[];
export declare function validateGrammar(options: {
    rules: Rule[];
    maxLookahead: number;
    tokenTypes: TokenType[];
    grammarName: string;
    errMsgProvider: IGrammarValidatorErrorMessageProvider;
}): IParserDefinitionError[];
export {};
