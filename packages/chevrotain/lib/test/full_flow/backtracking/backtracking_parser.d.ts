import { EmbeddedActionsParser } from "../../../src/parse/parser/traits/parser_traits";
export declare enum RET_TYPE {
    WITH_DEFAULT = 0,
    WITH_EQUALS = 1,
    QUALIFED_NAME = 2,
    INVALID_WITH_DEFAULT = 3,
    INVALID_WITH_EQUALS = 4,
    INVALID_STATEMENT = 5,
    INVALID_FQN = 6
}
export declare class NumberTok {
    static PATTERN: RegExp;
}
export declare class ElementTok {
    static PATTERN: RegExp;
}
export declare class DefaultTok {
    static PATTERN: RegExp;
}
export declare class DotTok {
    static PATTERN: RegExp;
}
export declare class ColonTok {
    static PATTERN: RegExp;
}
export declare class EqualsTok {
    static PATTERN: RegExp;
}
export declare class SemiColonTok {
    static PATTERN: RegExp;
}
export declare class IdentTok {
    static PATTERN: RegExp;
}
export declare class BackTrackingParser extends EmbeddedActionsParser {
    constructor();
    statement: import("@chevrotain/types").ParserMethod<[], RET_TYPE>;
    withEqualsStatement: import("@chevrotain/types").ParserMethod<[], RET_TYPE>;
    withDefaultStatement: import("@chevrotain/types").ParserMethod<[], RET_TYPE>;
    qualifiedName: import("@chevrotain/types").ParserMethod<[], RET_TYPE>;
    private parseStatement;
    private parseWithEqualsStatement;
    private parseWithDefaultStatement;
    private parseQualifiedName;
}
export declare function INVALID(stmtType: RET_TYPE): () => RET_TYPE;
