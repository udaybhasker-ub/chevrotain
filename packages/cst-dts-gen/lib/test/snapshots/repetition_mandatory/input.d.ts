import { CstParser } from "chevrotain";
declare class TestParser extends CstParser {
    constructor();
    testRule: import("chevrotain").ParserMethod<[], import("chevrotain").CstNode>;
}
export declare const parser: TestParser;
export {};
