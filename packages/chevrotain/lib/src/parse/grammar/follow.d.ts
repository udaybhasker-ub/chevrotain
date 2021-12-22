import { RestWalker } from "./rest";
import { NonTerminal, Rule, Terminal } from "./gast/gast_public";
import { IProduction, TokenType } from "@chevrotain/types";
export declare class ResyncFollowsWalker extends RestWalker {
    private topProd;
    follows: Record<string, TokenType[]>;
    constructor(topProd: Rule);
    startWalking(): Record<string, TokenType[]>;
    walkTerminal(terminal: Terminal, currRest: IProduction[], prevRest: IProduction[]): void;
    walkProdRef(refProd: NonTerminal, currRest: IProduction[], prevRest: IProduction[]): void;
}
export declare function computeAllProdsFollows(topProductions: Rule[]): Record<string, TokenType[]>;
export declare function buildBetweenProdsFollowPrefix(inner: Rule, occurenceInParent: number): string;
export declare function buildInProdFollowPrefix(terminal: Terminal): string;
