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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVALID = exports.INVALID_INPUT = exports.WRAP_IN_PT = exports.DDLExampleRecoveryParser = void 0;
/**
 * a language made of a series of statements terminated by semicolons
 *
 * CREATE TABLE schema2.Persons
 * INSERT (32, "SHAHAR") INTO schema2.Persons
 * DELETE (31, "SHAHAR") FROM schema2.Persons
 */
var values_1 = __importDefault(require("lodash/values"));
var parser_traits_1 = require("../../../../src/parse/parser/traits/parser_traits");
var allTokens = __importStar(require("./sql_recovery_tokens"));
var sql_recovery_tokens_1 = require("./sql_recovery_tokens");
var parse_tree_1 = require("../../parse_tree");
var tokens_1 = require("../../../../src/scan/tokens");
var matchers_1 = require("../../../utils/matchers");
// deferred execution to only run "inside" a test
function initTokens() {
    var allTokensToUse = __assign({}, allTokens);
    (0, tokens_1.augmentTokenTypes)((0, values_1.default)(allTokensToUse));
    return allTokensToUse;
}
// DOCS: to enable error recovery functionality one must extend BaseErrorRecoveryRecognizer
var DDLExampleRecoveryParser = /** @class */ (function (_super) {
    __extends(DDLExampleRecoveryParser, _super);
    function DDLExampleRecoveryParser(isRecoveryEnabled) {
        if (isRecoveryEnabled === void 0) { isRecoveryEnabled = true; }
        var _this = 
        // DOCS: note the first parameter in the super class. this is the namespace in which the token constructors are defined.
        //       it is mandatory to provide this map to be able to perform self analysis
        //       and allow the framework to "understand" the implemented grammar.
        _super.call(this, initTokens(), {
            recoveryEnabled: isRecoveryEnabled
        }) || this;
        // DOCS: the invocation to RULE(...) is what wraps our parsing implementation method
        // with the error recovery re-sync behavior.
        // note that when one parsing rule calls another (via SUBRULE) the invoked rule is the one defined here,
        // without the "parse" prefix.
        _this.ddl = _this.RULE("ddl", _this.parseDdl, {
            recoveryValueFunc: INVALID(sql_recovery_tokens_1.INVALID_DDL)
        });
        // DOCS: a specific return type has been provided in case of re-sync recovery.
        _this.createStmt = _this.RULE("createStmt", _this.parseCreateStmt, {
            recoveryValueFunc: INVALID(sql_recovery_tokens_1.INVALID_CREATE_STMT)
        });
        _this.insertStmt = _this.RULE("insertStmt", _this.parseInsertStmt, {
            recoveryValueFunc: INVALID(sql_recovery_tokens_1.INVALID_INSERT_STMT)
        });
        _this.deleteStmt = _this.RULE("deleteStmt", _this.parseDeleteStmt, {
            recoveryValueFunc: INVALID(sql_recovery_tokens_1.INVALID_DELETE_STMT)
        });
        _this.qualifiedName = _this.RULE("qualifiedName", _this.parseQualifiedName, {
            recoveryValueFunc: INVALID(sql_recovery_tokens_1.INVALID_QUALIFIED_NAME)
        });
        _this.recordValue = _this.RULE("recordValue", _this.parseRecordValue, {
            recoveryValueFunc: INVALID()
        });
        // DOCS: A Parsing rule may also be private and not part of the public API
        _this.value = _this.RULE("value", _this.parseValue, {
            recoveryValueFunc: INVALID()
        });
        // DOCS: The call to performSelfAnalysis needs to happen after all the RULEs have been defined
        //       The typescript compiler places the constructor body last after initializations in the class's body
        //       which is why place the call here meets the criteria.
        _this.performSelfAnalysis();
        return _this;
    }
    // DOCS: note how all the parsing rules in this example return a ParseTree, we require some output from the parser
    // to demonstrate the error recovery mechanisms. otherwise it is harder to prove we have indeed recovered.
    DDLExampleRecoveryParser.prototype.parseDdl = function () {
        var _this = this;
        var stmts = [];
        this.MANY(function () {
            _this.OR([
                {
                    ALT: function () {
                        stmts.push(_this.SUBRULE(_this.createStmt));
                    }
                },
                {
                    ALT: function () {
                        stmts.push(_this.SUBRULE(_this.insertStmt));
                    }
                },
                {
                    ALT: function () {
                        stmts.push(_this.SUBRULE(_this.deleteStmt));
                    }
                }
            ]);
        });
        return PT((0, matchers_1.createRegularToken)(sql_recovery_tokens_1.STATEMENTS), stmts);
    };
    DDLExampleRecoveryParser.prototype.parseCreateStmt = function () {
        var createKW = this.CONSUME1(sql_recovery_tokens_1.CreateTok);
        var tableKW = this.CONSUME1(sql_recovery_tokens_1.TableTok);
        var qn = this.SUBRULE(this.qualifiedName);
        var semiColon = this.CONSUME1(sql_recovery_tokens_1.SemiColonTok);
        return PT((0, matchers_1.createRegularToken)(sql_recovery_tokens_1.CREATE_STMT), [
            PT(createKW),
            PT(tableKW),
            qn,
            PT(semiColon)
        ]);
    };
    DDLExampleRecoveryParser.prototype.parseInsertStmt = function () {
        // parse
        var insertKW = this.CONSUME1(sql_recovery_tokens_1.InsertTok);
        var recordValue = this.SUBRULE(this.recordValue);
        var intoKW = this.CONSUME1(sql_recovery_tokens_1.IntoTok);
        var qn = this.SUBRULE(this.qualifiedName);
        var semiColon = this.CONSUME1(sql_recovery_tokens_1.SemiColonTok);
        // tree rewrite
        return PT((0, matchers_1.createRegularToken)(sql_recovery_tokens_1.INSERT_STMT), [
            PT(insertKW),
            recordValue,
            PT(intoKW),
            qn,
            PT(semiColon)
        ]);
    };
    DDLExampleRecoveryParser.prototype.parseDeleteStmt = function () {
        // parse
        var deleteKW = this.CONSUME1(sql_recovery_tokens_1.DeleteTok);
        var recordValue = this.SUBRULE(this.recordValue);
        var fromKW = this.CONSUME1(sql_recovery_tokens_1.FromTok);
        var qn = this.SUBRULE(this.qualifiedName);
        var semiColon = this.CONSUME1(sql_recovery_tokens_1.SemiColonTok);
        // tree rewrite
        return PT((0, matchers_1.createRegularToken)(sql_recovery_tokens_1.DELETE_STMT), [
            PT(deleteKW),
            recordValue,
            PT(fromKW),
            qn,
            PT(semiColon)
        ]);
    };
    DDLExampleRecoveryParser.prototype.parseQualifiedName = function () {
        var _this = this;
        var dots = [];
        var idents = [];
        // parse
        // DOCS: note how we use CONSUME1(IdentTok) here
        idents.push(this.CONSUME1(sql_recovery_tokens_1.IdentTok));
        this.MANY(function () {
            dots.push(_this.CONSUME1(sql_recovery_tokens_1.DotTok));
            // DOCS: yet here we use CONSUME2(IdentTok)
            //       The number indicates the occurrence number of the consumption of the specific Token in the current
            //       parse rule.
            idents.push(_this.CONSUME2(sql_recovery_tokens_1.IdentTok));
        });
        // tree rewrite
        var allIdentsPts = WRAP_IN_PT(idents);
        var dotsPt = PT((0, matchers_1.createRegularToken)(sql_recovery_tokens_1.DOTS), WRAP_IN_PT(dots));
        var allPtChildren = allIdentsPts.concat([dotsPt]);
        return PT((0, matchers_1.createRegularToken)(sql_recovery_tokens_1.QUALIFIED_NAME), allPtChildren);
    };
    DDLExampleRecoveryParser.prototype.parseRecordValue = function () {
        var _this = this;
        var values = [];
        var commas = [];
        // parse
        this.CONSUME1(sql_recovery_tokens_1.LParenTok);
        this.SUBRULE1(this.value);
        this.MANY(function () {
            commas.push(_this.CONSUME1(sql_recovery_tokens_1.CommaTok));
            values.push(_this.SUBRULE2(_this.value));
        });
        this.CONSUME1(sql_recovery_tokens_1.RParenTok);
        // tree rewrite
        var commasPt = PT((0, matchers_1.createRegularToken)(sql_recovery_tokens_1.COMMAS), WRAP_IN_PT(commas));
        var allPtChildren = values.concat([commasPt]);
        return PT((0, matchers_1.createRegularToken)(sql_recovery_tokens_1.QUALIFIED_NAME), allPtChildren);
    };
    DDLExampleRecoveryParser.prototype.parseValue = function () {
        var _this = this;
        var value;
        this.OR([
            {
                ALT: function () {
                    value = _this.CONSUME1(sql_recovery_tokens_1.StringTok);
                }
            },
            {
                ALT: function () {
                    value = _this.CONSUME1(sql_recovery_tokens_1.IntTok);
                }
            }
        ]);
        return PT(value);
    };
    return DDLExampleRecoveryParser;
}(parser_traits_1.EmbeddedActionsParser));
exports.DDLExampleRecoveryParser = DDLExampleRecoveryParser;
// HELPER FUNCTIONS
function PT(token, children) {
    if (children === void 0) { children = []; }
    return new parse_tree_1.ParseTree(token, children);
}
function WRAP_IN_PT(toks) {
    var parseTrees = new Array(toks.length);
    for (var i = 0; i < toks.length; i++) {
        parseTrees[i] = PT(toks[i]);
    }
    return parseTrees;
}
exports.WRAP_IN_PT = WRAP_IN_PT;
var INVALID_INPUT = /** @class */ (function (_super) {
    __extends(INVALID_INPUT, _super);
    function INVALID_INPUT() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    INVALID_INPUT.PATTERN = /NA/;
    return INVALID_INPUT;
}(sql_recovery_tokens_1.VirtualToken));
exports.INVALID_INPUT = INVALID_INPUT;
function INVALID(tokType) {
    if (tokType === void 0) { tokType = INVALID_INPUT; }
    // virtual invalid tokens should have no parameters...
    return function () {
        return PT((0, matchers_1.createRegularToken)(tokType));
    };
}
exports.INVALID = INVALID;
//# sourceMappingURL=sql_recovery_parser.js.map