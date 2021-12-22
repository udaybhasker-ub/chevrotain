import { EmbeddedActionsParser } from "../../../../src/parse/parser/traits/parser_traits";
import { VirtualToken } from "./sql_recovery_tokens";
import { ParseTree } from "../../parse_tree";
import { IToken, TokenType } from "@chevrotain/types";
export declare class DDLExampleRecoveryParser extends EmbeddedActionsParser {
    constructor(isRecoveryEnabled?: boolean);
    ddl: (idxInCallingRule?: number | undefined, ...args: any[]) => ParseTree;
    createStmt: (idxInCallingRule?: number | undefined, ...args: any[]) => ParseTree;
    insertStmt: (idxInCallingRule?: number | undefined, ...args: any[]) => ParseTree;
    deleteStmt: (idxInCallingRule?: number | undefined, ...args: any[]) => ParseTree;
    qualifiedName: (idxInCallingRule?: number | undefined, ...args: any[]) => ParseTree;
    recordValue: (idxInCallingRule?: number | undefined, ...args: any[]) => ParseTree;
    private value;
    private parseDdl;
    private parseCreateStmt;
    private parseInsertStmt;
    private parseDeleteStmt;
    private parseQualifiedName;
    private parseRecordValue;
    private parseValue;
}
export declare function WRAP_IN_PT(toks: IToken[]): ParseTree[];
export declare class INVALID_INPUT extends VirtualToken {
    static PATTERN: RegExp;
}
export declare function INVALID(tokType?: TokenType): () => ParseTree;
