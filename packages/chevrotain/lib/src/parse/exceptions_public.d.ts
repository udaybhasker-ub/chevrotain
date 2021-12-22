import { IToken, IRecognitionException, IRecognizerContext } from "@chevrotain/types";
export declare function isRecognitionException(error: Error): boolean;
declare abstract class RecognitionException extends Error implements IRecognitionException {
    token: IToken;
    context: IRecognizerContext;
    resyncedTokens: IToken[];
    protected constructor(message: string, token: IToken);
}
export declare class MismatchedTokenException extends RecognitionException {
    previousToken: IToken;
    constructor(message: string, token: IToken, previousToken: IToken);
}
export declare class NoViableAltException extends RecognitionException {
    previousToken: IToken;
    constructor(message: string, token: IToken, previousToken: IToken);
}
export declare class NotAllInputParsedException extends RecognitionException {
    constructor(message: string, token: IToken);
}
export declare class EarlyExitException extends RecognitionException {
    previousToken: IToken;
    constructor(message: string, token: IToken, previousToken: IToken);
}
export {};
