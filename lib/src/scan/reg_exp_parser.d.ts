import { Alternative, Assertion, Atom, Disjunction, RegExpPattern } from "regexp-to-ast";
export declare type ASTNode = RegExpPattern | Disjunction | Alternative | Assertion | Atom;
export declare function getRegExpAst(regExp: RegExp): RegExpPattern;
export declare function clearRegExpParserCache(): void;
