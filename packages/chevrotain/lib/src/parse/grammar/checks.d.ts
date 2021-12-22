import { IParserAmbiguousAlternativesDefinitionError, IParserEmptyAlternativeDefinitionError } from "../parser/parser";
import { Alternative } from "./lookahead";
import { Alternation, NonTerminal, Option, Repetition, RepetitionMandatory, RepetitionMandatoryWithSeparator, RepetitionWithSeparator, Rule, Terminal } from "./gast/gast_public";
import { GAstVisitor } from "./gast/gast_visitor_public";
import { IProduction, IProductionWithOccurrence, TokenType } from "@chevrotain/types";
import { IGrammarValidatorErrorMessageProvider, IParserDefinitionError } from "./types";
export declare function validateGrammar(topLevels: Rule[], globalMaxLookahead: number, tokenTypes: TokenType[], errMsgProvider: IGrammarValidatorErrorMessageProvider, grammarName: string): IParserDefinitionError[];
export declare function identifyProductionForDuplicates(prod: IProductionWithOccurrence): string;
export declare class OccurrenceValidationCollector extends GAstVisitor {
    allProductions: IProductionWithOccurrence[];
    visitNonTerminal(subrule: NonTerminal): void;
    visitOption(option: Option): void;
    visitRepetitionWithSeparator(manySep: RepetitionWithSeparator): void;
    visitRepetitionMandatory(atLeastOne: RepetitionMandatory): void;
    visitRepetitionMandatoryWithSeparator(atLeastOneSep: RepetitionMandatoryWithSeparator): void;
    visitRepetition(many: Repetition): void;
    visitAlternation(or: Alternation): void;
    visitTerminal(terminal: Terminal): void;
}
export declare function validateRuleDoesNotAlreadyExist(rule: Rule, allRules: Rule[], className: string, errMsgProvider: IGrammarValidatorErrorMessageProvider): IParserDefinitionError[];
export declare function validateRuleIsOverridden(ruleName: string, definedRulesNames: string[], className: string): IParserDefinitionError[];
export declare function validateNoLeftRecursion(topRule: Rule, currRule: Rule, errMsgProvider: IGrammarValidatorErrorMessageProvider, path?: Rule[]): IParserDefinitionError[];
export declare function getFirstNoneTerminal(definition: IProduction[]): Rule[];
export declare function validateEmptyOrAlternative(topLevelRule: Rule, errMsgProvider: IGrammarValidatorErrorMessageProvider): IParserEmptyAlternativeDefinitionError[];
export declare function validateAmbiguousAlternationAlternatives(topLevelRule: Rule, globalMaxLookahead: number, errMsgProvider: IGrammarValidatorErrorMessageProvider): IParserAmbiguousAlternativesDefinitionError[];
export declare class RepetitionCollector extends GAstVisitor {
    allProductions: (IProductionWithOccurrence & {
        maxLookahead?: number;
    })[];
    visitRepetitionWithSeparator(manySep: RepetitionWithSeparator): void;
    visitRepetitionMandatory(atLeastOne: RepetitionMandatory): void;
    visitRepetitionMandatoryWithSeparator(atLeastOneSep: RepetitionMandatoryWithSeparator): void;
    visitRepetition(many: Repetition): void;
}
export declare function validateTooManyAlts(topLevelRule: Rule, errMsgProvider: IGrammarValidatorErrorMessageProvider): IParserDefinitionError[];
export declare function validateSomeNonEmptyLookaheadPath(topLevelRules: Rule[], maxLookahead: number, errMsgProvider: IGrammarValidatorErrorMessageProvider): IParserDefinitionError[];
export interface IAmbiguityDescriptor {
    alts: number[];
    path: TokenType[];
}
export declare function checkPrefixAlternativesAmbiguities(alternatives: Alternative[], alternation: Alternation, rule: Rule, errMsgProvider: IGrammarValidatorErrorMessageProvider): IParserAmbiguousAlternativesDefinitionError[];
