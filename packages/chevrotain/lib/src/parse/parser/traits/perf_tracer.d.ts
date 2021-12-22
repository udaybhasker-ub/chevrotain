import { IParserConfig } from "@chevrotain/types";
import { MixedInParser } from "./parser_traits";
/**
 * Trait responsible for runtime parsing errors.
 */
export declare class PerformanceTracer {
    traceInitPerf: boolean | number;
    traceInitMaxIdent: number;
    traceInitIndent: number;
    initPerformanceTracer(config: IParserConfig): void;
    TRACE_INIT<T>(this: MixedInParser, phaseDesc: string, phaseImpl: () => T): T;
}
