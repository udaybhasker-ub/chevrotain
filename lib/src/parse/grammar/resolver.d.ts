import { IParserUnresolvedRefDefinitionError } from "../parser/parser";
import { NonTerminal, Rule } from "./gast/gast_public";
import { GAstVisitor } from "./gast/gast_visitor_public";
import { IGrammarResolverErrorMessageProvider, IParserDefinitionError } from "./types";
export declare function resolveGrammar(topLevels: Record<string, Rule>, errMsgProvider: IGrammarResolverErrorMessageProvider): IParserDefinitionError[];
export declare class GastRefResolverVisitor extends GAstVisitor {
    private nameToTopRule;
    private errMsgProvider;
    errors: IParserUnresolvedRefDefinitionError[];
    private currTopLevel;
    constructor(nameToTopRule: Record<string, Rule>, errMsgProvider: IGrammarResolverErrorMessageProvider);
    resolveRefs(): void;
    visitNonTerminal(node: NonTerminal): void;
}
