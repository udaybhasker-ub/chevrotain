import { CstNode, CstNodeLocation, ICstVisitor, IParserConfig, IToken, nodeLocationTrackingOptions } from "@chevrotain/types";
import { MixedInParser } from "./parser_traits";
/**
 * This trait is responsible for the CST building logic.
 */
export declare class TreeBuilder {
    outputCst: boolean;
    CST_STACK: CstNode[];
    baseCstVisitorConstructor: Function;
    baseCstVisitorWithDefaultsConstructor: Function;
    setNodeLocationFromNode: (nodeLocation: CstNodeLocation, locationInformation: CstNodeLocation) => void;
    setNodeLocationFromToken: (nodeLocation: CstNodeLocation, locationInformation: CstNodeLocation) => void;
    cstPostRule: (this: MixedInParser, ruleCstNode: CstNode) => void;
    setInitialNodeLocation: (cstNode: CstNode) => void;
    nodeLocationTracking: nodeLocationTrackingOptions;
    initTreeBuilder(this: MixedInParser, config: IParserConfig): void;
    setInitialNodeLocationOnlyOffsetRecovery(this: MixedInParser, cstNode: any): void;
    setInitialNodeLocationOnlyOffsetRegular(this: MixedInParser, cstNode: any): void;
    setInitialNodeLocationFullRecovery(this: MixedInParser, cstNode: any): void;
    /**
       *  @see setInitialNodeLocationOnlyOffsetRegular for explanation why this work
  
       * @param cstNode
       */
    setInitialNodeLocationFullRegular(this: MixedInParser, cstNode: any): void;
    cstInvocationStateUpdate(this: MixedInParser, fullRuleName: string, shortName: string | number): void;
    cstFinallyStateUpdate(this: MixedInParser): void;
    cstPostRuleFull(this: MixedInParser, ruleCstNode: CstNode): void;
    cstPostRuleOnlyOffset(this: MixedInParser, ruleCstNode: CstNode): void;
    cstPostTerminal(this: MixedInParser, key: string, consumedToken: IToken): void;
    cstPostNonTerminal(this: MixedInParser, ruleCstResult: CstNode, ruleName: string): void;
    getBaseCstVisitorConstructor<IN = any, OUT = any>(this: MixedInParser): {
        new (...args: any[]): ICstVisitor<IN, OUT>;
    };
    getBaseCstVisitorConstructorWithDefaults<IN = any, OUT = any>(this: MixedInParser): {
        new (...args: any[]): ICstVisitor<IN, OUT>;
    };
    getLastExplicitRuleShortName(this: MixedInParser): number;
    getPreviousExplicitRuleShortName(this: MixedInParser): number;
    getLastExplicitRuleOccurrenceIndex(this: MixedInParser): number;
}
