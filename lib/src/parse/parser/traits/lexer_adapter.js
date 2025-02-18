"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LexerAdapter = void 0;
var parser_1 = require("../parser");
/**
 * Trait responsible abstracting over the interaction with Lexer output (Token vector).
 *
 * This could be generalized to support other kinds of lexers, e.g.
 * - Just in Time Lexing / Lexer-Less parsing.
 * - Streaming Lexer.
 */
var LexerAdapter = /** @class */ (function () {
    function LexerAdapter() {
    }
    LexerAdapter.prototype.initLexerAdapter = function () {
        this.tokVector = [];
        this.tokVectorLength = 0;
        this.currIdx = -1;
    };
    Object.defineProperty(LexerAdapter.prototype, "input", {
        get: function () {
            return this.tokVector;
        },
        set: function (newInput) {
            // @ts-ignore - `this parameter` not supported in setters/getters
            //   - https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters
            if (this.selfAnalysisDone !== true) {
                throw Error("Missing <performSelfAnalysis> invocation at the end of the Parser's constructor.");
            }
            // @ts-ignore - `this parameter` not supported in setters/getters
            //   - https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters
            this.reset();
            this.tokVector = newInput;
            this.tokVectorLength = newInput.length;
        },
        enumerable: false,
        configurable: true
    });
    // skips a token and returns the next token
    LexerAdapter.prototype.SKIP_TOKEN = function () {
        if (this.currIdx <= this.tokVector.length - 2) {
            this.consumeToken();
            return this.LA(1);
        }
        else {
            return parser_1.END_OF_FILE;
        }
    };
    // Lexer (accessing Token vector) related methods which can be overridden to implement lazy lexers
    // or lexers dependent on parser context.
    LexerAdapter.prototype.LA = function (howMuch) {
        var soughtIdx = this.currIdx + howMuch;
        if (soughtIdx < 0 || this.tokVectorLength <= soughtIdx) {
            return parser_1.END_OF_FILE;
        }
        else {
            return this.tokVector[soughtIdx];
        }
    };
    LexerAdapter.prototype.consumeToken = function () {
        this.currIdx++;
    };
    LexerAdapter.prototype.exportLexerState = function () {
        return this.currIdx;
    };
    LexerAdapter.prototype.importLexerState = function (newState) {
        this.currIdx = newState;
    };
    LexerAdapter.prototype.resetLexerState = function () {
        this.currIdx = -1;
    };
    LexerAdapter.prototype.moveToTerminatedState = function () {
        this.currIdx = this.tokVector.length - 1;
    };
    LexerAdapter.prototype.getLexerPosition = function () {
        return this.exportLexerState();
    };
    return LexerAdapter;
}());
exports.LexerAdapter = LexerAdapter;
//# sourceMappingURL=lexer_adapter.js.map