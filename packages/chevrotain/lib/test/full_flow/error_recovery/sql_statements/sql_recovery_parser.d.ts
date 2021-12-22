import { EmbeddedActionsParser } from "../../../../src/parse/parser/traits/parser_traits";
import { VirtualToken } from "./sql_recovery_tokens";
import { ParseTree } from "../../parse_tree";
import { IToken, TokenType } from "@chevrotain/types";
export declare class DDLExampleRecoveryParser extends EmbeddedActionsParser {
    constructor(isRecoveryEnabled?: boolean);
    ddl: import("@chevrotain/types").ParserMethod<[], ParseTree>;
    createStmt: import("@chevrotain/types").ParserMethod<[], ParseTree>;
    insertStmt: import("@chevrotain/types").ParserMethod<[], ParseTree>;
    deleteStmt: import("@chevrotain/types").ParserMethod<[], ParseTree>;
    qualifiedName: import("@chevrotain/types").ParserMethod<[], ParseTree>;
    recordValue: import("@chevrotain/types").ParserMethod<[], ParseTree>;
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
