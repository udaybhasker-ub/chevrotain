import { IParserConfig, IParserErrorMessageProvider, IRecognitionException } from "@chevrotain/types";
import { PROD_TYPE } from "../../grammar/lookahead";
import { MixedInParser } from "./parser_traits";
/**
 * Trait responsible for runtime parsing errors.
 */
export declare class ErrorHandler {
    _errors: IRecognitionException[];
    errorMessageProvider: IParserErrorMessageProvider;
    initErrorHandler(config: IParserConfig): void;
    SAVE_ERROR(this: MixedInParser, error: IRecognitionException): IRecognitionException;
    get errors(): IRecognitionException[];
    set errors(newErrors: IRecognitionException[]);
    raiseEarlyExitException(this: MixedInParser, occurrence: number, prodType: PROD_TYPE, userDefinedErrMsg: string | undefined): never;
    raiseNoAltException(this: MixedInParser, occurrence: number, errMsgTypes: string | undefined): never;
}
