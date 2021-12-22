"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
var tokens_public_1 = require("../../../src/scan/tokens_public");
var lexer_public_1 = require("../../../src/scan/lexer_public");
var parser_traits_1 = require("../../../src/parse/parser/traits/parser_traits");
var parser_1 = require("../../../src/parse/parser/parser");
var exceptions_public_1 = require("../../../src/parse/exceptions_public");
var flatten_1 = __importDefault(require("lodash/flatten"));
var every_1 = __importDefault(require("lodash/every"));
var map_1 = __importDefault(require("lodash/map"));
var forEach_1 = __importDefault(require("lodash/forEach"));
var t;
function deferredInitTokens() {
    var Return = (0, tokens_public_1.createToken)({
        name: "Return",
        pattern: /return/
    });
    var DivisionOperator = (0, tokens_public_1.createToken)({
        name: "DivisionOperator",
        pattern: /\//
    });
    var RegExpLiteral = (0, tokens_public_1.createToken)({
        name: "RegExpLiteral",
        pattern: /\/\d+\//
    });
    var NumberLiteral = (0, tokens_public_1.createToken)({
        name: "NumberLiteral",
        pattern: /\d+/
    });
    // todo differentiate line terminators and other whitespace?
    var WhiteSpace = (0, tokens_public_1.createToken)({
        name: "WhiteSpace",
        pattern: /\s+/,
        group: lexer_public_1.Lexer.SKIPPED,
        line_breaks: true
    });
    var Semicolon = (0, tokens_public_1.createToken)({
        name: "Semicolon",
        pattern: /;/
    });
    var allTokens = {
        WhiteSpace: WhiteSpace,
        NumberLiteral: NumberLiteral,
        Return: Return,
        DivisionOperator: DivisionOperator,
        RegExpLiteral: RegExpLiteral,
        Semicolon: Semicolon
    };
    // Avoids errors in browser tests where the bundled specs will execute this
    // file even if the tests will avoid running it.
    if (typeof new RegExp("(?:)").sticky === "boolean") {
        (0, forEach_1.default)(allTokens, function (currTokType) {
            currTokType.PATTERN = new RegExp(currTokType.PATTERN.source, "y");
        });
    }
    t = allTokens;
    return allTokens;
}
var ErrorToken = (0, tokens_public_1.createToken)({ name: "ErrorToken" });
var EcmaScriptQuirksParser = /** @class */ (function (_super) {
    __extends(EcmaScriptQuirksParser, _super);
    function EcmaScriptQuirksParser() {
        var _this = _super.call(this, deferredInitTokens()) || this;
        _this.statement = _this.RULE("statement", function () {
            _this.CONSUME(t.Return);
            _this.OPTION7(function () {
                _this.SUBRULE(_this.expression);
            });
            _this.CONSUME(t.Semicolon);
        });
        _this.expression = _this.RULE("expression", function () {
            _this.SUBRULE(_this.atomic);
            _this.MANY(function () {
                _this.CONSUME(t.DivisionOperator);
                _this.SUBRULE2(_this.atomic);
            });
        });
        _this.atomic = _this.RULE("atomic", function () {
            _this.OR6([
                { ALT: function () { return _this.CONSUME(t.RegExpLiteral); } },
                { ALT: function () { return _this.CONSUME(t.NumberLiteral); } }
            ]);
        });
        _this.performSelfAnalysis();
        return _this;
    }
    Object.defineProperty(EcmaScriptQuirksParser.prototype, "textInput", {
        get: function () {
            return this.orgText;
        },
        // lexer related methods
        set: function (newInput) {
            this.reset();
            this.orgText = newInput;
        },
        enumerable: false,
        configurable: true
    });
    // TODO: this should be protected at least but there seems some strange bug in the
    // definitions generation, try adding protected in newer releases of typescript.
    EcmaScriptQuirksParser.prototype.resetLexerState = function () {
        this.textIdx = 0;
    };
    EcmaScriptQuirksParser.prototype.IS_NEXT_TOKEN = function (expectedType) {
        if (this.orgText.length <= this.textIdx) {
            return parser_1.END_OF_FILE;
        }
        else {
            this.skipWhitespace();
            return this.consumeExpected(expectedType);
        }
    };
    EcmaScriptQuirksParser.prototype.skipWhitespace = function () {
        var wsPattern = t.WhiteSpace.PATTERN;
        wsPattern.lastIndex = this.textIdx;
        var wsMatch = wsPattern.exec(this.orgText);
        if (wsMatch !== null) {
            var wsLength = wsMatch[0].length;
            this.textIdx += wsLength;
        }
    };
    EcmaScriptQuirksParser.prototype.consumeExpected = function (expectedType) {
        // match expected
        var expectedPattern = expectedType.PATTERN;
        expectedPattern.lastIndex = this.textIdx;
        var match = expectedPattern.exec(this.orgText);
        if (match !== null) {
            var image = match[0];
            var startOffset = this.textIdx;
            var newToken = {
                tokenType: expectedType,
                tokenTypeIdx: expectedType.tokenTypeIdx,
                image: image,
                startOffset: startOffset
            };
            this.textIdx += image.length;
            return newToken;
        }
        return false;
    };
    EcmaScriptQuirksParser.prototype.consumeInternal = function (tokClass, idx) {
        this.skipWhitespace();
        var nextToken = this.consumeExpected(tokClass);
        if (nextToken !== false) {
            return nextToken;
        }
        else {
            var errorToken = {
                tokenType: ErrorToken,
                tokenTypeIdx: ErrorToken.tokenTypeIdx,
                image: this.orgText[this.textIdx],
                startOffset: this.textIdx
            };
            var previousToken = this.LA(0);
            var msg = this.errorMessageProvider.buildMismatchTokenMessage({
                expected: tokClass,
                actual: errorToken,
                previous: previousToken,
                ruleName: this.getCurrRuleFullName()
            });
            throw this.SAVE_ERROR(new exceptions_public_1.MismatchedTokenException(msg, errorToken, previousToken));
        }
    };
    EcmaScriptQuirksParser.prototype.exportLexerState = function () {
        return this.textIdx;
    };
    EcmaScriptQuirksParser.prototype.importLexerState = function (newState) {
        this.textIdx = newState;
    };
    EcmaScriptQuirksParser.prototype.lookAheadBuilderForOptional = function (alt, tokenMatcher, dynamicTokensEnabled) {
        if (!(0, every_1.default)(alt, function (currAlt) { return currAlt.length === 1; })) {
            throw Error("This scannerLess parser only supports LL(1) lookahead.");
        }
        var allTokenTypes = (0, flatten_1.default)(alt);
        return function () {
            // save & restore lexer state as otherwise the text index will move ahead
            // and the parser will fail consuming the tokens we have looked ahead for.
            var lexerState = this.exportLexerState();
            try {
                for (var i = 0; i < allTokenTypes.length; i++) {
                    var nextToken = this.IS_NEXT_TOKEN(allTokenTypes[i]);
                    if (nextToken !== false) {
                        return true;
                    }
                }
                return false;
            }
            finally {
                // this scannerLess parser is not very smart and efficient
                // because we do not remember the last token was saw while lookahead
                // we will have to lex it twice, once during lookahead and once during consumption...
                this.importLexerState(lexerState);
            }
        };
    };
    EcmaScriptQuirksParser.prototype.lookAheadBuilderForAlternatives = function (alts, hasPredicates, tokenMatcher, dynamicTokensEnabled) {
        if (!(0, every_1.default)(alts, function (currPath) {
            return (0, every_1.default)(currPath, function (currAlt) { return currAlt.length === 1; });
        })) {
            throw Error("This scannerLess parser only supports LL(1) lookahead.");
        }
        var allTokenTypesPerAlt = (0, map_1.default)(alts, flatten_1.default);
        return function () {
            // save & restore lexer state as otherwise the text index will move ahead
            // and the parser will fail consuming the tokens we have looked ahead for.
            var lexerState = this.exportLexerState();
            try {
                for (var i = 0; i < allTokenTypesPerAlt.length; i++) {
                    var currAltTypes = allTokenTypesPerAlt[i];
                    for (var j = 0; j < currAltTypes.length; j++) {
                        var nextToken = this.IS_NEXT_TOKEN(currAltTypes[j]);
                        if (nextToken !== false) {
                            return i;
                        }
                    }
                }
                return undefined;
            }
            finally {
                // this scannerLess parser is not very smart and efficient
                // because we do not remember the last token was saw while lookahead
                // we will have to lex it twice, once during lookahead and once during consumption...
                this.importLexerState(lexerState);
            }
        };
    };
    return EcmaScriptQuirksParser;
}(parser_traits_1.EmbeddedActionsParser));
// reuse the same parser instance.
var parser;
function parse(text) {
    if (parser === undefined) {
        parser = new EcmaScriptQuirksParser();
    }
    parser.textInput = text;
    var value = parser.statement();
    return {
        value: value,
        errors: parser.errors
    };
}
exports.parse = parse;
//# sourceMappingURL=ecma_quirks.js.map