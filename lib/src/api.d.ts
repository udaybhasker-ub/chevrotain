export { VERSION } from "./version";
export { CstParser, EmbeddedActionsParser, ParserDefinitionErrorType, EMPTY_ALT } from "./parse/parser/parser";
export { Lexer, LexerDefinitionErrorType } from "./scan/lexer_public";
export { createToken, createTokenInstance, EOF, tokenLabel, tokenMatcher, tokenName } from "./scan/tokens_public";
export { defaultParserErrorProvider } from "./parse/errors_public";
export { EarlyExitException, isRecognitionException, MismatchedTokenException, NotAllInputParsedException, NoViableAltException } from "./parse/exceptions_public";
export { defaultLexerErrorProvider } from "./scan/lexer_errors_public";
export { Alternation, Alternative, NonTerminal, Option, Repetition, RepetitionMandatory, RepetitionMandatoryWithSeparator, RepetitionWithSeparator, Rule, Terminal } from "./parse/grammar/gast/gast_public";
export { serializeGrammar, serializeProduction } from "./parse/grammar/gast/gast_public";
export { GAstVisitor } from "./parse/grammar/gast/gast_visitor_public";
export declare function clearCache(): void;
export { createSyntaxDiagramsCode } from "./diagrams/render_public";
export declare class Parser {
    constructor();
}
