import { CstNodeTypeDefinition } from "./model";
export declare type GenDtsOptions = {
    includeTypes: boolean;
    includeVisitorInterface: boolean;
    visitorInterfaceName: string;
};
export declare function genDts(model: CstNodeTypeDefinition[], options: GenDtsOptions): string;
