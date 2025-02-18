/**
 * a simple language made up of only
 * switch/case/return identifiers strings and integers
 *
 * example:
 * switch (name) {
 *    case "Terry" : return 2;
 *    case "Robert" : return 4;
 *    case "Brandon" : return 6;
 * }
 *
 * In this case the parser result is a "JSON" object representing the switch case:
 * for the above example the result would be:
 *
 * {
 *    "Terry"    : 2,
 *    "Robert"   : 4,
 *    "Brandon"   : 6
 * }
 *
 * forEach invalid case statement an invalidN property will be added
 * with an undefined value. for example :
 *
 * {
 *    "Terry"    : 2,
 *    "invalid1  : undefined
 *    "Brandon"   : 6
 * }
 */
import { EmbeddedActionsParser } from "../../../../src/parse/parser/traits/parser_traits";
import { IToken, TokenType } from "@chevrotain/types";
export interface RetType {
    [caseValue: string]: number | undefined;
}
export declare class SwitchCaseRecoveryParser extends EmbeddedActionsParser {
    constructor(input?: IToken[]);
    switchStmt: (idxInCallingRule?: number | undefined, ...args: any[]) => {};
    caseStmt: (idxInCallingRule?: number | undefined, ...args: any[]) => RetType;
    private tokTypesThatCannotBeInsertedInRecovery;
    canTokenTypeBeInsertedInRecovery(tokType: TokenType): boolean;
    parseSwitchStmt(): RetType;
    private parseCaseStmt;
    private invalidIdx;
    private INVALID;
}
