import { Alternation, NonTerminal, Option, Repetition, RepetitionMandatory, RepetitionMandatoryWithSeparator, RepetitionWithSeparator, Rule, Terminal } from "./gast_public";
import { GAstVisitor } from "./gast_visitor_public";
import { IProduction, IProductionWithOccurrence } from "@chevrotain/types";
export declare function isSequenceProd(prod: IProduction): boolean;
export declare function isOptionalProd(prod: IProduction, alreadyVisited?: NonTerminal[]): boolean;
export declare function isBranchingProd(prod: IProduction): boolean;
export declare function getProductionDslName(prod: IProductionWithOccurrence): string;
export declare class DslMethodsCollectorVisitor extends GAstVisitor {
    separator: string;
    dslMethods: {
        [subruleOrTerminalName: string]: IProductionWithOccurrence[];
        option: Option[];
        alternation: Alternation[];
        repetition: Repetition[];
        repetitionWithSeparator: RepetitionWithSeparator[];
        repetitionMandatory: RepetitionMandatory[];
        repetitionMandatoryWithSeparator: RepetitionMandatoryWithSeparator[];
    };
    reset(): void;
    visitTerminal(terminal: Terminal): void;
    visitNonTerminal(subrule: NonTerminal): void;
    visitOption(option: Option): void;
    visitRepetitionWithSeparator(manySep: RepetitionWithSeparator): void;
    visitRepetitionMandatory(atLeastOne: RepetitionMandatory): void;
    visitRepetitionMandatoryWithSeparator(atLeastOneSep: RepetitionMandatoryWithSeparator): void;
    visitRepetition(many: Repetition): void;
    visitAlternation(or: Alternation): void;
}
export declare function collectMethods(rule: Rule): {
    option: Option[];
    alternation: Alternation[];
    repetition: Repetition[];
    repetitionWithSeparator: RepetitionWithSeparator[];
    repetitionMandatory: RepetitionMandatory[];
    repetitionMandatoryWithSeparator: RepetitionMandatoryWithSeparator[];
};
