import { ICstVisitor } from "@chevrotain/types";
export declare function defaultVisit<IN>(ctx: any, param: any, matchingIndices?: any): void;
export declare function createBaseSemanticVisitorConstructor(grammarName: string, ruleNames: string[]): {
    new (...args: any[]): ICstVisitor<any, any>;
};
export declare function createBaseVisitorConstructorWithDefaults(grammarName: string, ruleNames: string[], baseConstructor: Function): {
    new (...args: any[]): ICstVisitor<any, any>;
};
export declare enum CstVisitorDefinitionError {
    REDUNDANT_METHOD = 0,
    MISSING_METHOD = 1
}
export interface IVisitorDefinitionError {
    msg: string;
    type: CstVisitorDefinitionError;
    methodName: string;
}
export declare function validateVisitor(visitorInstance: ICstVisitor<unknown, unknown>, ruleNames: string[]): IVisitorDefinitionError[];
export declare function validateMissingCstMethods(visitorInstance: ICstVisitor<unknown, unknown>, ruleNames: string[]): IVisitorDefinitionError[];
export declare function validateRedundantMethods(visitorInstance: ICstVisitor<unknown, unknown>, ruleNames: string[]): IVisitorDefinitionError[];
