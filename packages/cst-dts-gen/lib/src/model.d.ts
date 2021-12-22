import { Rule } from "chevrotain";
export declare function buildModel(productions: Record<string, Rule>): CstNodeTypeDefinition[];
export declare type CstNodeTypeDefinition = {
    name: string;
    properties: PropertyTypeDefinition[];
};
export declare type PropertyTypeDefinition = {
    name: string;
    type: PropertyArrayType;
    optional: boolean;
};
export declare type PropertyArrayType = TokenArrayType | RuleArrayType;
export declare type TokenArrayType = {
    kind: "token";
};
export declare type RuleArrayType = {
    kind: "rule";
    name: string;
};
