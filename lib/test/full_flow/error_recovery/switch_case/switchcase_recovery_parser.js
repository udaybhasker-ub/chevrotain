"use strict";
/**
 * a simple language made up of only
 * switch/case/return identifiers strings and integers
 *
 * example:
 * switch (name) {
 *    case "Terry" : return 2;
 *    case "Robert" : return 4;
 *    case "Brandon" : return 6;
 * }
 *
 * In this case the parser result is a "JSON" object representing the switch case:
 * for the above example the result would be:
 *
 * {
 *    "Terry"    : 2,
 *    "Robert"   : 4,
 *    "Brandon"   : 6
 * }
 *
 * forEach invalid case statement an invalidN property will be added
 * with an undefined value. for example :
 *
 * {
 *    "Terry"    : 2,
 *    "invalid1  : undefined
 *    "Brandon"   : 6
 * }
 */
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
exports.SwitchCaseRecoveryParser = void 0;
var parser_traits_1 = require("../../../../src/parse/parser/traits/parser_traits");
var allTokens = __importStar(require("./Switchcase_recovery_tokens"));
var Switchcase_recovery_tokens_1 = require("./Switchcase_recovery_tokens");
var assign_1 = __importDefault(require("lodash/assign"));
var includes_1 = __importDefault(require("lodash/includes"));
var SwitchCaseRecoveryParser = /** @class */ (function (_super) {
    __extends(SwitchCaseRecoveryParser, _super);
    function SwitchCaseRecoveryParser(input) {
        if (input === void 0) { input = []; }
        var _this = _super.call(this, __assign({}, allTokens), {
            recoveryEnabled: true
        }) || this;
        _this.switchStmt = _this.RULE("switchStmt", _this.parseSwitchStmt, {
            recoveryValueFunc: function () {
                return {};
            }
        });
        _this.caseStmt = _this.RULE("caseStmt", _this.parseCaseStmt, {
            recoveryValueFunc: _this.INVALID()
        });
        // DOCS: in this example we avoid automatic missing token insertion for tokens that have additional semantic meaning.
        //       to understand this first consider the positive case, which tokens can we safely insert?
        //       a missing colon / semicolon ? yes a missing parenthesis ? yes
        //       but what about a missing StringToken? if we insert one, what will be its string value?
        //       an empty string? in the grammar this could lead to an empty key in the created object...
        //       what about a string with some random value? this could still lead to duplicate keys in the returned parse result
        _this.tokTypesThatCannotBeInsertedInRecovery = [Switchcase_recovery_tokens_1.IdentTok, Switchcase_recovery_tokens_1.StringTok, Switchcase_recovery_tokens_1.IntTok];
        // because we are building a javascript object we must not have any duplications
        // in the name of the keys, the index below is used to solve this.
        _this.invalidIdx = 1;
        _this.performSelfAnalysis();
        return _this;
    }
    // DOCS: overriding this method allows us to customize the logic for which tokens may not be automatically inserted
    // during error recovery.
    SwitchCaseRecoveryParser.prototype.canTokenTypeBeInsertedInRecovery = function (tokType) {
        return !(0, includes_1.default)(this.tokTypesThatCannotBeInsertedInRecovery, tokType);
    };
    SwitchCaseRecoveryParser.prototype.parseSwitchStmt = function () {
        var _this = this;
        // house keeping so the invalid property names will not be dependent on
        // previous grammar rule invocations.
        this.invalidIdx = 1;
        var retObj = {};
        this.CONSUME(Switchcase_recovery_tokens_1.SwitchTok);
        this.CONSUME(Switchcase_recovery_tokens_1.LParenTok);
        this.CONSUME(Switchcase_recovery_tokens_1.IdentTok);
        this.CONSUME(Switchcase_recovery_tokens_1.RParenTok);
        this.CONSUME(Switchcase_recovery_tokens_1.LCurlyTok);
        this.AT_LEAST_ONE(function () {
            (0, assign_1.default)(retObj, _this.SUBRULE(_this.caseStmt));
        });
        this.CONSUME(Switchcase_recovery_tokens_1.RCurlyTok);
        return retObj;
    };
    SwitchCaseRecoveryParser.prototype.parseCaseStmt = function () {
        var _this = this;
        this.CONSUME(Switchcase_recovery_tokens_1.CaseTok);
        var keyTok = this.CONSUME(Switchcase_recovery_tokens_1.StringTok);
        this.CONSUME(Switchcase_recovery_tokens_1.ColonTok);
        this.CONSUME(Switchcase_recovery_tokens_1.ReturnTok);
        var valueTok = this.CONSUME(Switchcase_recovery_tokens_1.IntTok);
        this.OPTION6(function () {
            _this.CONSUME(Switchcase_recovery_tokens_1.SemiColonTok);
        });
        var key = keyTok.image;
        var value = parseInt(valueTok.image, 10);
        var caseKeyValue = {};
        caseKeyValue[key] = value;
        return caseKeyValue;
    };
    SwitchCaseRecoveryParser.prototype.INVALID = function () {
        var _this = this;
        return function () {
            var retObj = {};
            retObj["invalid" + _this.invalidIdx++] = undefined;
            return retObj;
        };
    };
    return SwitchCaseRecoveryParser;
}(parser_traits_1.EmbeddedActionsParser));
exports.SwitchCaseRecoveryParser = SwitchCaseRecoveryParser;
//# sourceMappingURL=switchcase_recovery_parser.js.map